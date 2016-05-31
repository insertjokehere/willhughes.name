+++
date = "2016-05-31T19:37:49+12:00"
description = ""
draft = true
tags = []
title = "DS3231 Real Time Clock on a Raspberry Pi with Ubuntu Xenial"
topics = []

+++

By this point I really don't need to explain how great the Raspberry Pi is - a nice useful lump of computing power for not very much money{{< ann 1 >}}. The low price point does mean that you loose some features that come standard on larger computers though, and one of the less obvious omissions is a 'real time clock' module to keep track of time while the main computer is powered off.

<!--more-->

The reason for omitting this is pretty obvious - even though RTC modules are fairly inexpensive, the extra circuitry and space for a battery would be hard to justify for a device that is going to be network connected and therefore able to sync its clock over NTP. For most things, this trade off doesn't really matter; just add an init script to run ntpdate after the network comes up but before ntpd starts and the difference becomes an implementation detail{{< ann 2 >}}.

The obvious exception for this is when you are in an environment where you *don't* have a reliable network link, so can't run ntpd. Fortunatly, as previously mentioned, RTC modules are fairly inexpensive. I'm using a DS3231 TCXO{{< ann 3 >}} I2C Module{{< ann 4 >}}, although there are others available.

The software side of things is a bit fiddly to get setup properly. Because the DS3231 connects over I2C, the driver doesn't automatically detect the device. You need to tell the I2C bus that you've added the device, then the kernel will detect that it can load a driver for the device{{< ann 5 >}}. Once the device is detected and drivers loaded, you use the `hwclock` tool to set the system clock from the hardware clock. Ubuntu does include an init script at `/etc/init.d/hwclock.sh` to run hwclock at startup, but this is of no use to us because the clock device will not be recognized by the kernel when this script run, so we need to do this for ourselves. I'm running Ubuntu Xenial{{< ann 6 >}} on my Raspberry Pi 3, so I'm doing this using SystemD unit files.

My unit file looks like this:

{{< highlight ini >}}
[Unit]
Description=Enable DS3231 I2C RTC

[Service]
Type=oneshot
ExecStartPre=/bin/bash -c "echo ds1307 0x68 | tee /sys/class/i2c-adapter/i2c-1/new_device"
ExecStart=/sbin/hwclock -s

[Install]
WantedBy=basic.target
{{< /highlight >}}

The `ExecStartPre` pokes some magic values{{< ann 7 >}} into the right place in the right places in sysfs to get the I2C device to detect the device, and the `ExecStart` runs `hwclock` to set the system time. I'm setting this unit to be `WantedBy` basic.target, so the clock gets set correctly as early in the boot process as possible. We don't need to do anything special for shutdown, the `hwclock.sh` init script handles saving the system time back to the hardware clock for us. To enable the unit, write the file to `/etc/systemd/system/ds3231.system`, and run `systemctl enable ds3231` to set it to run on boot.

If the RTC module is fresh from the factory, or hasn't been plugged in in a while, you will need to set the time on the module. The easiest way to do this is to set the system clock, either using ntp or by hand if you really cannot ever get a network connection to this machine{{< ann 8 >}}, then run `hwclock -w`.

### My Weird Use Case

The Pis that I'm using this for are actually about as far from not having a reliable network connection as you can get - they are a pair of Pi 3 B's that run as a load balanced pair, and serve DHCP and DNS for my home network. DNS is where this gets tricky. I'm running [Unbound](https://www.unbound.net/) as a caching recursive nameserver for machines on my network, and making use of its DNSSEC validation features. As it turns out DNSSEC, like other security protocols, needs a reasonably accurate clock to work properly. Unbound is less picky than some other tools in this regard, but gets really, really unhappy when you give it a root anchor file{{< ann 9 >}} that doesn't become valid for several years. Unbound will return `SERVFAIL` responses to all queries until you correct the clock, and even with log verbosity set to full, the only hint as to what is wrong is the super helpful "failed to prime trust anchor" message.

This presents a bit of a catch-22, no DNS until the clock is set right, but I can't use NTP to set the clock until I have DNS to look up a server to use. I could have done something crazy and hard-coded the IP of another machine on the network to act as a low-stratum NTP peer to get the clock close enough to get DNS working, or disabled DNSSEC in Unbound until I've set the clock, but for a few dollars an RTC module is much less hacky

#### Notes
1. {{< ann_text 1 >}}oh, and the whole democratisation of computer education and all that jazz
2. {{< ann_text 2 >}}this is, in fact, what Raspbian does
2. {{< ann_text 3 >}}temperature-compensated crystal oscillator - the frequency which a crystal oscillator ticks is dependant on temperature, so a TCXO adds extra circuity to account for this
3. {{< ann_text 4 >}}from [Nicegear](https://nicegear.co.nz/raspberry-pi/high-precision-real-time-clock-for-raspberry-pi/), although you can get them a bit cheaper from eBay
5. {{< ann_text 5 >}}Confusingly, the DS3231 it uses the rtc_ds1307 driver
6. {{< ann_text 6 >}}Ryan Finnies' images from [the Ubuntu wiki](https://wiki.ubuntu.com/ARM/RaspberryPi)
7. {{< ann_text 7 >}}If you are using something other than a DS3231, you will need to tweak the values you are echoing to the sysfs. If you are using an old school Rev 1 Pi B, you will need to `tee` to `/sys/class/i2c-adapter/i2c-0/new_device` instead
8. {{< ann_text 8 >}}Airgapped Bitcoin vault or something? You can set the clocks on another Pi and move them across
9. {{< ann_text 9 >}}Think of it as the equivelant of the root CA cert in the TLS PKI
