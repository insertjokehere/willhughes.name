+++
date = "2016-03-15T18:12:37+13:00"
description = ""
draft = false
tags = ["Not Strictly Useful", "Thinkpad"]
title = "Controlling the Thinklight from the command line"
topics = []

+++

I found out I can toggle most of the lights on my laptop from the command line in Ubuntu. I don't know how this is going to be useful, but I'm sure at some point it will be.

<!--more-->

I have a Lenovo{{< ann 1 >}} Thinkpad T420 that I use as a secondary workstation when I don't need the full power of my main desktop (and don't want to be too anti-social shutting myself away in the office). Its great - rugged, repairable, cheap, powerful enough for my purposes{{< ann 2 >}} and given that it looks like a relic from the Soviet era unlikely to get stolen. One of the features it has that I'm sure seemed like a good idea at the time is a LED just above the webcam with a lens that lets it illuminates maybe 30% of the keyboard, which some clever marketing person decided should be called a Thinklight. Yup.

Anyway, it turns out that the Linux kernel that ships with Ubuntu includes a driver{{< ann 3 >}} that exposes the Thinklight - and for some reason, the power and sleep LEDs - as targets for the Linux LED subsystem. The practical upshot of this is you can control the LEDs by writing magic values into special files in the sysfs.

This means you can do:

{{< highlight bash >}}
echo 1 | sudo tee /sys/class/leds/tpacpi::thinklight/brightness
{{< /highlight >}}

to turn the light on and

{{< highlight bash >}}
echo 0 | sudo tee /sys/class/leds/tpacpi::thinklight/brightness
{{< /highlight >}}

to turn if off again. Which is cool. Kinda. I don't know why its useful to know this.

The kernel also defines an interface that allows developers to write 'triggers' to decide when a particular LED should be lit. You can inspect which triggers are available on a system by inspecting the 'trigger' virtual file.

{{< highlight bash >}}
cat /sys/class/leds/tpacpi::thinklight/trigger
{{< /highlight >}}

and select a trigger by writing the name to the same file:

{{< highlight bash >}}
echo heartbeat | sudo tee /sys/class/leds/tpacpi::thinklight/trigger
{{< /highlight >}}

#### Notes

1. {{< ann_text 1 >}} I almost always type IBM first and have to correct myself. Old habits die hard.
2. {{< ann_text 2 >}} My workloads are usually memory-bound, and I've maxed it out at 16GB
3. {{< ann_text 3 >}} I think this is provided by the ``thinkpad_acpi`` driver, so if you don't see the folders in ``/sys/class/led``, you may need to do a ``sudo modprobe thinkpad_acpi`` to load the driver
