+++
date = "2016-09-27T23:00:12+13:00"
description = ""
draft = true
tags = ["Ubuntu", "Raspberry Pi"]
title = "Raspberry Pi 3 Bluetooth on Ubuntu Xenial"
topics = []

+++

Ubuntu Xenial isn't an offically supported operating system for the Raspberry Pi, but there are [images](https://wiki.ubuntu.com/ARM/RaspberryPi) available for both the Pi 2 and Pi 3 in Trusty and Xenial versions. I've found the Xenial image works quite well, but as I recently discovered the Bluetooth chip that is present on the Pi 3 isn't detected at all out of the box. Getting it working turned out to be a bit of a mission.

## The short version

1. Add my personal [apt repo](/repo) to your system
1. Install the `pi-bluetooth` package
1. `sudo service hciuart start`{{<ann 1>}}
1. Run `hcitool dev`, and make sure the MAC reported looks plausable

## Details

Bluetooth on the Pi 3 is provided by a Broadcom BCM43438 - the same chip that provides the WiFi connection - which supports Bluetooth 4.1 as well as BTLE. I'm not sure why the WiFi component of this chip work out of the box but the Bluetooth parts don't. The Bluetooth component connects to the host system over UART. At power on, the Bluetooth component just waits for the host system to write a firmware blob over the UART. Once it has its firmware, the Bluetooth chip can start up and begin processing commands.

There are a few components needed to make this work:

- Firmware blob
- Tool to write firmware into chip memory
- Tool to translate commands over UART
- Service to make this all happen automatically

### Firmware

Broadcom provides{{<ann 2>}} a binary firmware blob for this chip in the form of a file called `BCM43430A1.hcd`{{< ann 3 >}}. I have built a Debian package [`pi-firmware-bt`](https://github.com/insertjokehere/pi-firmware-bt) that installs this file into `/lib/firmware/brcm` where it can be found by `hciattach`.

### hciattach

BlueZ provides a tool to do both the 'write firmware' and 'connect to device over UART' called `hciattach`. Unfortunatly, the version that ships with Ubuntu doesn't work very reliably on the Pi 3. The patches I'm using I found in the [Yocto project layer](https://git.yoctoproject.org/cgit/cgit.cgi/meta-raspberrypi/tree/recipes-connectivity/bluez5/bluez5) for the Pi, but seem to [originate](http://archive.raspberrypi.org/debian/pool/main/b/bluez/bluez_5.23-2+rpi2.debian.tar.xz) with the Pi foundation itself. The package I'm building is [`hciattach-rpi3`](https://github.com/insertjokehere/hciattach-rpi3) which just contains the patched `hciattach` as `hciattach-rpi3` so it doesn't conflict with the 'real' BlueZ package.

One gotcha with `hciattach` is that it will attempt to start the device even if it can't find a firmware blob to load. In this case, you will end up with a device visible when you run `hcitool dev`, but the MAC address will be shown as `AA:AA:AA:AA:AA:AA` and commands sent to the device will time out. `hciattach` doesn't always reset the device correctly when it stops, in this case trying to start `hciattach` again will usually succeed.

### Service

`hciattach` needs to be running in the background to use the device. The command that needs to be run is `/usr/bin/hciattach-rpi3 /dev/ttyAMA0 bcm43xx 921600 noflow -`. I've [packaged](https://github.com/insertjokehere/pi-bluetooth) a systemd unit file that runs this command as appropriate as `pi-bluetooth`. This package also depends on the `hciattach-rpi3` and `pi-firmware-bt` packages.

## References

- https://aur.archlinux.org/packages/hciattach-rpi3/
- https://aur.archlinux.org/packages/pi-bluetooth/
- https://git.yoctoproject.org/cgit/cgit.cgi/meta-raspberrypi/tree/recipes-connectivity/bluez5/bluez5
- http://archive.raspberrypi.org/debian/pool/main/b/bluez/bluez_5.23-2+rpi2.debian.tar.xz
- https://archive.raspberrypi.org/debian/pool/main/b/bluez-firmware/

### Notes

1. {{<ann_text 1>}} It may take a couple of tries to start the service sucessfully
1. {{<ann_text 2>}} Under a somewhat restrictive [licence](https://raw.githubusercontent.com/insertjokehere/pi-firmware-bt/master/LICENCE.broadcom_bcm43xx) 
1. {{<ann_text 3>}} SHA1 sum `c0fff507841e02396c981174c546046d9c80cf04`. As far as I can tell, this is the only version of the firmware available
