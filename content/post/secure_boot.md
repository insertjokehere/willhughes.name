+++
draft = false
date = "2022-04-24T21:50:54+12:00"
tags = ["Ubuntu", "LVM", "Security"]
title = "Actually Secure Boot"
slug = "actually-secure-boot"
description = ""
+++

In case you hadn't noticed, computers have gotten rather complicated over the last few years.

<!--more-->

One of the ares this is most apparent, is in their firmware - entire operating systems{{< ann 1 >}} deadicated to the deceptively complex task of just getting the damn thing up and running. With all this complexity comes useful features, including "Secure Boot" - the wonderous ability to establish a "chain of trust"{{< ann 2 >}} where each piece of the operating system is cryptographically verified by the previous piece in the chain, so you can be fairly sure{{< ann 3 >}} that if there is some malicious code on your computer, it isn't hiding in the operating system or a device driver. This doesn't entirely eliminate the risk of malware, but it does make bad guys sad, which means its worth doing.

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

Once `grubx64.efi` is loaded, it needs to go find _its_ config files. `grubx64.efi` is just the EFI version of the old "GRUB 2" bootloader that Linux has been using for decades, and it needs to know where to find the Linux kernel and an "initramfs" - a small compressed filesystem that contains all the scripts and tools needed to find the _real_ root filesystem, ask the user for the password, mount it, and hand control of the boot process over to an `init` process like SystemD to start the graphical environment. It will search through the available storage devices until it finds what its looking for, loads the config and follows it to find a kernel and initramfs to load, and the "command line" to pass to the kernel.

## The Boot Process - now with Security™

With Secure Boot enabled, the process follows a pretty similar pattern. Instead of loading `grubx64.efi`, the firmware will load `shimx64.efi`, and will check to see if it carries a digital signature from an authority that it trusts. It does this by consulting a list of public keys in its configuration, and in our case, it will likely find that `shimx64.efi` is signed by one of Microsofts' public keys, so the boot process can continue. The shim will then find `grubx64.efi`, check that it has been signed by Canonical, and run it. GRUB will find its config file as normal, only this time it will check back in with `shimx64.efi` to verify that the kernel it is about to run has _also_ been signed by Canonical. Neat and tidy - from power on to kernel load, signatures validated at every step.

### Diversion: Microsofts' cheat

A few paragraphs back I talked about how Microsoft cheats a little to make this process easier for themselves. As part of their hardware compatibility rules, any vendor selling a computer with Windows pre-installed _must_ have Microsofts' EFI keys installed in firmware from the factory. This "root of trust" gives them an _enormous_ advantage here - the vast majority of new computers come out-of-the-box able to verify that the loader they are booting hasn't been tampered with, which can then verify the kernel, which can verify the device drivers and on up the chain. Canonical _could_ work with a similar system, but they'd need a way of getting the keys onto the machines in the first place. You could do this as part of the install process, but the installer itself couldn't be verified because there aren't any keys in the system to verify it _with_. How do you know your installer hasn't been tampered with?

Obviously, having this great advantage over their competitors is a great thing for Microsoft, but in order to stave off interest from regulators, they struck a deal with the major Linux vendors. They would sign a shim loader for each of them, with the vendors' own public keys embedded in it. That way, users could boot an installer, that could be verified by the firmware as not having been tampered with, without needing some untrusted code to install keys.

## The Flaw

The secure boot process for Ubuntu has one pretty bit hole in it. Because of the way the Linux kernel is architected, the kernel isn't able to prompt the user for a password to decrypt their disk - talking to users is a job for the userland - so it will use the `cryptsetup` script from the `initramfs` to do this. The same `cryptsetup` from the same `initramfs` that we _didn't verify signatures on_ before loading. Oh dear. We have no way of knowing if the program that we are typing our password into has been tampered with. In an ideal world, GRUB would be able to check a signature on the `initramfs`, but each machine generates its own `initramfs` on every upgrade - signing these would require storing the public keys somewhere so they could be verified, and we are back to "root of trust" problem. Another solution would be to not run security-sensitive code from within the `initramfs`, and only run it once the main root filesystem has been decrypted - but this leads us to a chicken-and-egg problem; how do you decrypt something without being able to ask for a key, or store the key securely?

I should note that I'm treating full disk encryption and executable signing as being equivalent security controls here. Strictly, they aren't, but for the purposes of securing the boot process they achieve the same thing - making it so that an attacker with access to a powered-off machine can't tamper with it such that they can run their own code next time it powers on. Signing does this by making it impossible to stealthily change the file without the private key to re-sign it, encryption does it by making it impossible{{< ann 7 >}} to write your modified file without knowing the password.

Practically, this isn't a huge flaw. It would require someone with access to your computer while you weren't around{{< ann 8 >}} to trojan your `initramfs` to collect your password or inject some malware into your root file system. Its impact is pretty large - at this point, it isn't really your computer any more - but the number of people who might be directly targetted by someone sophisticated enough to pull off this kind of attack but who don't have [better ways](https://xkcd.com/538/) of getting what they want isn't that big.

## The Solution

There are a few practical ways to address this flaw, I chose to sign the kernel and my `initramfs` using my own keys, and to install the public keys into the firmware of my system. The private portion of the keys are stored in the encrypted root filesystem - this allows `apt` to automatically sign updates, without exposing the private portions of the keys while the system if powered off. You could take this a step further by storing the keys on a separate encrypted device that you only attach when you are installing updates, but I figured that I'm much more likely to get caught out by a bug in the kernel that I didn't patch because I didn't have my signing keys to hand than I am by something stealing the signing keys and installing a trojaned update{{< ann 9 >}}.

Instead of signing the `initramfs` and kernel separately, we will combine the kernel, the initramfs and the command line into one EFI program, and sign that. This we, we can get rid of the whole shim/grub dance and directly boot our kernel, and make it so that any tampering with the kernel, initramfs or kernel command line will cause the computer to refuse to boot.

## Just tell my how to set this up already

These instructions assume a modern, EFI capable computer that you intend to wipe all data from and start from a clean install of Ubuntu 20.04 Focal Fossa. Instructions are likely to be the same for other versions of Ubuntu, and for Ubuntu-derived distributions.

### 1. Initial Prep

* Download and prep a USB installer for Ubuntu, making sure to verify the checksum on the ISO
* Reboot your machine into its EFI setup interface
* Set a configuration password - there is no point going to all this effort of someone can trivially disable secure boot by accessing the setup utility
* Ensure secure boot is enabled
* Disable legacy/BIOS boot - BIOS boot bypasses secure boot, and it is important that we boot the installer in EFI mode

Once everything is configured, boot into the live installer.

### 2. Disk Setup

Before we get started with the install process properly we need to partition our disks. These steps are somewhat opinionated, but at a minimum you should ensure that you have created an EFI system partition, and that the remainder of the disk is encrypted. Commands below assume `/dev/nvme0n1` is the disk you intend to use - substitue as appropriate - and should be run in as root.

* First, initialize the disk as GPT, and create the ESP and a partition for our LUKS container
```bash
parted /dev/nvme0n1
# Reinitilize the disk as GPT
mklabel gpt
# parted will ask you to confirm. Make sure you understand its warning
# Create a 1GB ESP. Each kernel image bundle is ~75MB, 2x bundles installed at once. 1GB is way more than we actually need, but its a pain to resize later
mkpart primary fat32 0.00MB 1GB
# Partition the rest of the disk as one big LUKS container - we'll use LVM to partition it up later
mkpart primary 1GB 512GB
quit
```

* Next, set up LUKS. This command use `Argon2` as a key derivation function, and `AES-xts` as a cipher, which seem like reasonable choices. Make sure to choose a good password.
```bash
cryptsetup luksFormat --cipher aes-xts-plain64 --hash sha512 --pbkdf argon2id /dev/nvme0n1p2
```

* Now we unlock{{< ann 10 >}} the new encrypted container and format it using LVM. I'm using `ubuntu` as the group name here.
```bash
# Unlock the encrypted container
cryptsetup luksOpen /dev/nvme0n1p1 ubuntu
# Format it as a physical volume
pvcreate /dev/mapper/ubuntu
# Create a new volume group
vgcreate ubuntu /dev/mapper/ubuntu
```

A detailed guide to LVM is kinda out of the scope of this article, but the short version is that you take block devices (like our virtual LUKS device), format them as "physical volumes", bundle 1 or more PVs into a "volume group", then within that group create new "logical volumes". These logical volumes act kinda like partitions, but give you a ton more flexability around resizing them, moving them between disks and much more.

* Now we've got the volume group set up, we can create some logical volumes that we'll actually use to store Ubuntu and our home partition. Adapt sizes and layout to fit your personal tastes, but note that we aren't creating a `/boot` partition - there is no need.
```bash
lvcreate --size 30G --name root ubuntu
lvcreate --size 50G --name home ubuntu
lvcreate --size 8G --name swap ubuntu
```

### 3. The Actual Install

Now that we've got all the disk set up out the way, we can run the installer. Install Ubuntu as normal, except that:
* Choose manual partitioning, and set up the partition map like:

| Device | Mount Point | Format As |
| ---- | ---- | ---- |
| `/dev/nvme0n1p1` | /boot/efi | `fat32` |
| `/dev/ubuntu/root` | / | `ext4` |
| `/dev/ubuntu/home` | /home | `ext4` |
| `/dev/ubuntu/swap` | - | `swap` |

* The installer will warn you that you have not set a `/boot` partition. This is OK, we don't need one
* During the install, you will be asked what boot manager you want to install. Select "None".

Don't reboot once the installer completes.

### 4. `chroot`

Our new install isn't bootable in its current state, but we need to run some commands from inside the new environment to install some new packages and modify some config. The `chroot` command lets us spawn a new shell with a "changed root" - tricking it into thinking that it is running inside our new install without having to boot into it from scratch!

* First, we need to set up a file system layout
```bash
# Create a folder for our filesystem
mkdir /tmp/target
# Mount the root filesystem first
mount /dev/ubuntu/root /tmp/target
# Then the rest of our filesystems
mount /dev/ubuntu/home /tmp/target/home
mount /dev/nvme0n1p1 /tmp/target/boot/efi
# And /proc, /dev and /sys so we can access devices from inside the chroot
mount --bind /dev /tmp/target/dev
mount --bind /sys /tmp/target/sys
mount --bind /proc /tmp/target/proc
```

* Then spawn the new shell
```bash
chroot /tmp/target
```

### 5. Generate Signing Keys

We need to generate our own keys to sign the kernel bundles with - later we'll "enroll" these keys in our system firmware so it will only boot things signed by us.

* Grab [this script](/files/secure_boot/gen_keys.sh){{< ann 11 >}}, and run it{{< ann 12 >}}:
```bash
mkdir /boot/keys
cd /boot/keys
wget https://www.willhughes.name/files/secure_boot/gen_keys.sh
chmod +x gen_keys.sh
./gen_keys.sh
```

* Copy the `.auth`, `.esl` and `.cer` files to the ESP - these are the public keys, we'll need them later
```
mkdir /boot/efi/keys
cp *.auth *.esl *.cer /boot/efi/keys
```

### 6. Configure

Now we need to configure the system to build the combined kernel + initramfs bundles.

* Ensure we have the right packages installed
```bash
apt-get update
apt-get purge grub-efi shim shim-signed mokutil
apt-get install sbsigntool binutils cryptsetup-initramfs efitools
```

* Add our LUKS volume to `/etc/crypttab` to it gets unlocked automatically at boot
```bash
blkid /dev/nvme0n1p2
# Take a note of the UUID field (not the PARTUUID)
nano /etc/crypttab
ubuntu UUID=... none luks,discard
```

* Check that the installer generated `/etc/fstab` correctly - ensure that `/`, `/boot/efi`, `/home` and `swap` are all listed

* Next, we need to set up a script to build and sign the kernel bundle any time the kernel is updated. Download [this script](/files/secure_boot/sign_image.sh){{< ann 13 >}} and install it as a post-update hook for `update-initramfs`, then run it manually.
```bash
wget https://www.willhughes.name/files/secure_boot/sign_image.sh
chmod +x sign_image.sh
mv sign_image.sh /etc/initramfs/post-update.d/sign_image.sh
update-initramfs -u -k all
```

* Once this completes, we should have signed kernel bundles at `/boot/efi/EFI/UbuntuFocal/BOOTX64.EFI` and `/boot/efi/EFI/UbuntuFocalFallback/BOOTX64.EFI` - we now need to tell EFI about them so it gives us the option to boot them

```bash
efibootmgr --create --disk /dev/nvme0n1 --part 1 -L "Ubuntu Focal" -l "/EFI/UbuntuFocal/BOOTX64.EFI"
efibootmgr --create --disk /dev/nvme0n1 --part 1 -L "Ubuntu Focal (Fallback)" -l "/EFI/UbuntuFocalFallback/BOOTX64.EFI"
# Now we need to set the boot order so it tries to boot Ubuntu first
efibootmgr
# Find the IDs for our new targets and enter them here
efibootmgr --bootorder 000X,000X
```

### 7. Enroll Your Keys

Now that we've generated signing keys and used them to sign our own kernel, we need to tell the EFI firmware about them. We'll use the `KeyTool.efi` program to do this, which we installed as part of the `efitools` package in step 6{{< ann 14 >}}. We need to set up `KeyTool.efi` as a bootable program, then put the firmware into secure boot setup mode so that we can load the new keys.

* Copy `signtool.efi` to the ESP, and add an entry to let us boot into it
```bash
mkdir /boot/efi/EFI/tools
cp /usr/share/efitools/efi/KeyTool.efi /boot/efi/EFI/tools/KeyTool.efi
efibootmgr --create --disk /dev/nvme0n1 --part 1 -L "KeyTool" -l "/EFI/tools/KeyTool.efi"
```
* Quit out of the chroot and clean up
```bash
exit
umount /tmp/target/{home,dev,proc,sys}
umount /tmp/target
```
* Reboot into your EFI machines' EFI setup interface again
* In the secure boot settings, you are looking for an option to clear the configured keys or to enter "setup mode". This removes the Microsoft keys from the firmware configuration, disables secure boot, and puts the firmware in a mode where it allows new keys to be added
* Boot into KeyTool and select "Edit Keys" then "Add New Key". Find your ESP in the list, and find the folder where the keys are stored. Select `DB.cer`, then `KEK.cer`, then finally `PK.auth`
* At this point, secure boot should be enabled and require programs to be signed with your own keys. Check that secure boot is enabled in the EFI settings, then boot Ubuntu.

Congratulations! Your machine will now refuse to boot any software that isn't signed by your own keys.

### 8. Other Tidy Up

Now that you have a working Ubuntu environment, there is a couple of other things you might want to set up.

#### DKMS

When booted with secure boot, the Linux kernel will refuse to load kernel modules that aren't signed by either the systems' secure boot keys or a key embedded in the kernel when it was compiled. This prevents malicious kernel modules from being loaded, but means we need to ensure that we sign any kernel modules we compile ourselves through DKMS (such as the Nvidia driver).

* Download [this script](/files/secure_boot/sign_modules.sh) as `/usr/local/bin/sign_modules.sh`
* For every module that needs to be signed, create a matching configuration file in `/etc/dkms` (eg, `/etc/dkms/nvidia.conf`) with the content:
```bash
POST_BUILD="../../../../../../usr/local/bin/sign_modules.sh ../$kernelver/$arch/module/*.ko*"
```

#### fwupd

fwupd manages installing firmware updates for the various devices installed in a Linux computer. To do this, it needs to be able to boot an EFI program, which we've just made it impossible to do. Ubuntu doesn't ship unsigned versions of `fwupdx64.efi`, but fortunately its pretty easy to add a second signature to an EFI file.

```bash
# Ensure fwupdate is installed
apt-get install fwupd fwupd-signed
# Sign the file
sudo /usr/bin/sbsign --key /boot/keys/DB.key --cert /boot/keys/DB.crt /usr/libexec/fwupd/efi/fwupdx64.efi.signed --output /usr/libexec/fwupd/efi/fwupdx64.efi.signed
# Check that it worked
sudo sbverify --list /usr/libexec/fwupd/efi/fwupdx64.efi.signed
# This should list both your key and the Canonical key
```

Once thats done, edit `/etc/fwupd/uefi_capsule.conf` and set `DisableShimForSecureBoot` to `true`

## References

* https://www.rodsbooks.com/efi-bootloaders/controlling-sb.html
* https://threat.tevora.com/secure-boot-tpm-2/
* https://ubuntu.com/blog/how-to-sign-things-for-secure-boot
* https://wiki.archlinux.org/index.php/Fwupd#Secure_Boot
* https://web.archive.org/web/20210215173902/https://gist.github.com/dop3j0e/2a9e2dddca982c4f679552fc1ebb18df

#### Notes

1. {{< ann_text 1 >}}yes, plural. The system firmware itself, the management engine bits baked into your CPU - there is even a _ton_ of software running on each storage device. Yo dawg, computers in your computer etc.
2. {{< ann_text 2 >}}blockchain jokes aren't welcome, blockchain enthusiasts even less so
3. {{< ann_text 3 >}}nation state actors nonwithstanding, but to paraphrase [James Mickens](https://www.usenix.org/system/files/1401_08-12_mickens.pdf), personal risk can be broadly broken down into "targetted by a state actor" and "not targetted by a state actor". If its the latter, you will probably be OK. If its the former, stop using computers.
4. {{< ann_text 4 >}}"ESP" for short
5. {{< ann_text 5 >}}You may notice that the terms "EFI" and "UEFI" get used interchangeably - UEFI has quite a long and storied history, and at one point was known as EFI - they are effectively synonyms, feel free to use them as such. I sure do.
6. {{< ann_text 6 >}}_typically_, because most users don't have more than one SSD in their machine. It can be on any storage device that your computers' firmware knows how to read
7. {{< ann_text 7 >}}I say "impossible", but if you do find a way around them, let me know, we can split the prize money
8. {{< ann_text 8 >}}an "evil maid"
9. {{< ann_text 9 >}}if you are considering going to that much effort to get into my laptop, do get in touch. I'm sure we could work something out
10. {{< ann_text 10 >}}kinda like mounting. LUKS takes a block device (like a hard drive partition) that contains encrypted data, and gives us a new virtual block device that we can read or write unencrypted data to
11. {{< ann_text 11 >}}based on a script from [Roderick W. Smith](https://www.rodsbooks.com/efi-bootloaders/controlling-sb.html)
12. {{< ann_text 12 >}}After having read through it and understood what its doing, right?
13. {{< ann_text 13 >}}Again, actually it. Its not a long script, and you've read this much already.
14. {{< ann_text 14 >}}When I first did this, the KeyTool from the Ubuntu repos didn't work on my Lenovo P43s so I manually grabbed the KeyTool.efi from the Debian Sid repo and used that instead. I suspect this has been fixed in more recent versions