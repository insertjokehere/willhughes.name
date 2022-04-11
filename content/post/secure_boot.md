+++
draft = true
tags = []
topics = []
description = ""
title = "Actually Secure Boot"
+++

In case you hadn't noticed, computers have gotten rather complicated over the last few years. One of the ares this is most apparent, is in their firmware - entire operating systems{{< ann 1 >}} deadicated to the deceptively complex task of just getting the damn thing up and running. 

<!-- more -->

With all this complexity comes useful features, including "Secure Boot" - the wonderous ability to establish a "chain of trust"{{< ann 2 >}} where each piece of the operating system is cryptographically verified by the previous piece in the chain, so you can be fairly sure{{< ann 3 >}} that if there is some malicious code on your computer, it isn't hiding in the operating system or a device driver. This doesn't entirely eliminate the risk of malware, but it does make bad guys sad, which means its worth doing.

## Using Secure Boot

Taking advantage of Secure Boot on a modern computer running a modern OS is easy - so easy, that Microsoft _requires_ that you have Secure Boot turned on to install Windows!

1. Ensure Secure Boot is turned on in your computers' UEFI config
2. Install the OS of your choice - Windows or Linux - using the recommended settings from the manufacturer
3. There is not step 3

Easy. Job Done, go home, end of article.

Obviously, not actually - unless you are running Windows, but Microsoft cheats a bit here - more on that in a sec. Before we can talk about what the default configuration _doesn't_ do, we need to talk about how Secure Boot - and the Linux boot process in general - works.

## The Boot Process - The Short Version

This whole process is _full_ of caveats and details and but-actuallys, but for this we'll gloss over some details and assume that you are trying to boot recent Ubuntu on a modern computer in UEFI mode, with an encrypted root filesystem, but with Secure Boot turned off.

As soon as your computer has any power at all (even if its not "on" yet), the platform firmware will be running in its own ultra-low-power CPU, keeping track of the battery, the charging subsystem, the power button, the clock - all the little bits that need to still be active even when the computer is off. This firmware is also responsible for bringing the main CPU online when you press the power button. As soon as you do, it gets busy loading the UEFI firmware out of a flash chip on the motherboard into RAM and bringing the main CPU up to start running this mini-OS.

The main CPU, freshly booted with UEFI code in hand, will turn the graphics card on to give you some information about whats going on, and will start trying to find storage and network devices to bring online. Its main goal is to find an EFI program to load and run - what that program does, it doesn't really care - but typically, these programs will be small "loaders" that find and boot a full OS. To do this, it reads a small chunk of configuration data from the flash on the motherboard which gives it a list of programs to try, what devices they live on, and the order to try them in. Typically, the first item in this list will be an instruction to load `grubx64.efi` off the "EFI System Partition"{{< ann 4 >}}{{< ann 5 >}} - a small, FAT32 partition at the start of your "main" storage device{{< ann 6 >}}.

Once `grubx64.efi` is loaded, it needs to go find _its_ config files. `grubx64.efi` is just the EFI version of the old "GRUB 2" bootloader that Linux has been using for decades, and it needs to know where to find the Linux kernel, and an "initramfs" - a small compressed filesystem that contains all the scripts and tools needed to find the _real_ root filesystem, ask the user for the password, mount it, and hand control of the boot process over to an `init` process like SystemD to start the graphical environment. It will search through the available storage devices until it finds what its looking for, loads the config and follows it to find a kernel and initramfs to load.

## The Boot Process - now with Security™

With Secure Boot enabled, the process follows a pretty similar pattern. Instead of loading `grubx64.efi`, the firmware will load `shimx64.efi`, and will check to see if it carries a digital signature from an authority that it trusts. It does this by consulting a list of public keys in its configuration, and in our case, it will likely find that `shimx64.efi` is signed by one of Microsofts' public keys, so the boot process can continue. The shim will then find `grubx64.efi`, check that it has been signed by Canonical, and run it. GRUB will find its config file as normal, only this time it will check back in with `shimx64.efi` to verify that the kernel it is about to run has _also_ been signed by Canonical. Neat and tidy - from power on to kernel load, signatures validated at every step.

### Diversion: Microsofts' cheat

A few paragraphs back I talked about how Microsoft cheats a little to make this process easier for themselves. As part of their hardware compatibility rules, any vendor selling a computer with Windows pre-installed _must_ have Microsofts' EFI keys installed in firmware from the factory. This "root of trust" gives them an _enormous_ advantage here - the vast majority of new computers come out-of-the-box able to verify that the loader they are booting hasn't been tampered with, which can then verify the kernel, which can verify the device drivers and on up the chain. Canonical _could_ work with a similar system, but they'd need a way of getting the keys onto the machines in the first place. You could do this as part of the install process, but the installer itself couldn't be verified because there aren't any keys in the system to verify it _with_. How do you know your installer hasn't been tampered with?

Obviously, having this great advantage over their competitors is a great thing for Microsoft, but in order to stave off interest from regulators, they struck a deal with the major Linux vendors. They would sign a shim loader for each of them, with their own public keys embedded in it. That way, users could boot an installer, that could be verified by the firmware as not having been tampered with, without needing some untrusted code to install keys.

## The Flaw

The secure boot process for Ubuntu has one pretty bit hole in it. Because of the way the Linux kernel is architected, the kernel isn't able to prompt the user for a password to decrypt their disk - talking to users is a job for the userland - so it will use the `cryptsetup` script from the `initramfs` to do this. The same `cryptsetup` from the same `initramfs` that we _didn't verify signatures on_ before loading. Oh dear. We have no way of knowing if the program that we are typing our password into has been tampered with. In an ideal world, GRUB would be able to check a signature on the `initramfs`, but each machine generates its own `initramfs` on every upgrade - signing these would require storing the public keys somewhere so they could be verified, and we are back to "root of trust" problem. Another solution would be to not run security-sensitive code from within the `initramfs`, and only run it once the main root filesystem has been decrypted - but this leads us to a chicken-and-egg problem; how do you decrypt something without being able to ask for a key, or store the key securely?

I should note that I'm treating full disk encryption and executable signing as being equivalent security controls here. Strictly, they aren't, but for the purposes of securing the boot process they achieve the same thing - making it so that an attacker with access to a powered-off machine can't tamper with it such that they can run their own code next time it powers on. Signing does this by making it impossible to stealthily change the file without the private key to re-sign it, encryption does it by making it impossible{{< ann 7 >}} to write your modified file without knowing the password.

Practically, this isn't a huge flaw. It would require someone with access to your computer while you weren't around{{< ann 8 >}} to trojan your `initramfs` to collect your password or inject some malware into your root file system. Its impact is pretty large - at this point, it isn't really your computer any more - but the number of people who might be directly targetted by someone sophisticated enough to pull off this kind of attack but who don't have [better ways](https://xkcd.com/538/) of getting what they want isn't that big.

## The Solution

There are a few practical ways to address this flaw, I chose to sign my `initramfs` using my own keys, and to install the public keys into the firmware of my system. The private portion of the keys are stored in the encrypted root filesystem - this allows `apt` to automatically sign updates, without exposing the private portions of the keys while the system if powered off. You could take this a step further by storing the keys on a separate encrypted device that you only attach when you are installing updates, but I figured that I'm much more likely to get caught out by a bug in the kernel that I didn't patch because I didn't have my signing keys to hand than I am by something stealing the signing keys and installing a trojaned update{{< ann 9 >}}.

More specifically, EFI kernel image, add the initramfs to it, sign the load, bypass grub and the shim

#### Notes

1. {{< ann_text 1 >}}yes, plural. The system firmware itself, the management engine bits baked into your CPU - there is even a _ton_ of software running on each storage device. Yo dawg, computers in your computer etc.
2. {{< ann_text 2 >}}blockchain jokes aren't welcome, blockchain enthusiasts even less welcome
3. {{< ann_text 3 >}}nation state actors nonwithstanding, but to paraphrase [James Mickens](https://www.usenix.org/system/files/1401_08-12_mickens.pdf), personal risk can be broadly broken down into "targetted by a state actor" and "not targetted by a state actor". If its the latter, you will probably be OK. If its the former, stop using computers.
4. {{< ann_text 4 >}}"ESP" for short
5. {{< ann_text 5 >}}You may notice that the terms "EFI" and "UEFI" get used interchangeably - UEFI has quite a long and storied history, and at one point was known as EFI - they are effectively synonyms, feel free to use them as such. I sure do.
6. {{< ann_text 6 >}}_typically_, because most users don't have more than one SSD in their machine. It can be on any storage device that your computers' firmware knows how to read
7. {{< ann_text 7 >}}I say "impossible", but if you do find a way around them, let me know, we can split the prize money
8. {{< ann_text 8 >}}an "evil maid"
9. {{< ann_text 9 >}}if you are considering going to that much effort to get into my laptop, do get in touch. I'm sure we could work something out