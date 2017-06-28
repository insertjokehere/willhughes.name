+++
tags = ["IoT", "Reverse Engineering"]
draft = false
description = ""
topics = []
date = "2017-06-28T22:58:52+12:00"
title = "Reverse Engineering the Orvibo S20c WiFi Switch"
slug = "reverse_engineering_orvibo_s20c"

+++

*This post is a work-in-progress, and will be updated as I figure more things out*

<!--more-->

{{< contents >}}
{{% contentsitem index="1" title="Attempt 1: New Firmware" %}}
{{% contentsitem index="2" title="Attempt 2: Packet Capture" %}}
{{< /contents >}}

{{% section index="1" title="Attempt 1: New Firmware" %}}

*27 Jun 2017*

I've got an Orvibo S20 WiFi switch hooked up to the light on one of my fish tanks. It's great; cheep{{< ann 1 >}}, easy to set up{{< ann 2 >}} and plays nicely with HomeAssistant so I can script it to turn on and off{{< ann 3 >}}.

I've recently brought a second fish tank, so I ordered another two switches - again from AliExpress, this time for $15 each. The packaging had changed a bit, and it wasn't until I had opened things up and tried to plug them in that I found that I had been sent the "new" S20c switches instead. Physically these look identical{{< ann 4 >}} but seem to have very different internals, are controlled by a different app{{< ann 5 >}} and talk a different protocol.

{{< gallery title="">}}

{{% galleryimage file="IMG_20170627_193941.jpg" size="2610x4640" caption="The front of an S20c" copyrightHolder="William Hughes" %}}
{{% galleryimage file="IMG_20170627_193951.jpg" size="2610x4640" caption="The rear of an S20c" copyrightHolder="William Hughes" %}}
{{% galleryimage file="IMG_20170614_215640.jpg" size="4640x2610" caption="The S20c internals. Note the chip labeled '8266'" copyrightHolder="William Hughes" %}}
{{< /gallery >}}

On the advice of a colleague I cracked open one of my switches (this was actually really easy, undo one screw on the back, and use a spudger to pop the front off) to see if there was an easy way to reprogram them. It turns out that many of these cheep WiFi enabled devices that have been produced in the last couple of years use an Espressif 8266 SoC, and some manufacturers are even so kind as to leave pads (and in one case, a full connector) for a FTDI-to-USB adapter on the board. This would, in theory at least, let you write your own firmware and flash it onto the SoC.

No such luck in this case, although the device does seem to run on an 8266. There isn't anywhere on the top of the board that I can see where I could tap into a serial connection. You probably could solder wires onto the chip, but my soldering skills probably aren't up to the task. I couldn't work out how to get the board out of the case to check the bottom without de-soldering the plug part, and the goal is to have a working switch at the end of all this.

Next step: get the control app installed on an old phone, and try to capture some packets.

{{% section index="2" title="Attempt 2: Packet Capture" %}}

*28 Jun 2017*

I set my laptop up as a WiFi access point{{< ann 6 >}}, and ran Wireshark on the interface to capture the traffic between my phone at the switch. At least that was the intention, because it doesn't seem like the control app on the phone connects directly to the switch - it connects over port 10001 to a server `homemate.orvibo.com` (`54.201.177.6` at time of writing, looks like an ec2 instance in AWS us-west-2). Both the phone and the switch connect to this port on the same server, and commands from the app get relayed to the switch. A few obvious things:

* If the internet goes out, or the switch can't talk to the server for whatever reason, you can't control the switch at all
* The pattern of the packets between the phone, the server and the switch look somewhat similar to the packets used by the old S20 'WiWo' app - they all start with `0x68 0x64 0x00`
* Watching the traffic between the phone app and the Homemate server during account creation (and you *must* create an account before you can connect anything), the registration seems to go over plain HTTP, no SSL
* The Homemate app is installable from Google Play, but will immediately try to download an updated APK, and requires you to enable "untrusted sources" before you can install the update

Next steps:

* Try to capture more packets. Especially to try and identify the specific packets to send to the switch for "turn on" and "turn off". Also of interest: if you manually press the toggle button on the switch, what does the packet reporting the state change look like?
* Connect my other switch and compare packets. The S20 included the MAC address of the switch in packets, perhaps a similar scheme here?
* Redirect traffic for the Homemate server to my laptop, write a script to set up a TCP listener and try simple packet replays, see how far I can get doing that

{{% galleryinit %}}

#### Notes

1. {{< ann_text 1 >}}~ $20NZD off AliExpress, compared to the $70 for a Belkin-branded device that does the same thing
1. {{< ann_text 2 >}}install app from Google Play, give it WiFi creds, done
1. {{< ann_text 3 >}}even when the internet goes away!
1. {{< ann_text 4 >}}those plastic molding forms are expensive after all
1. {{< ann_text 5 >}}which isn't on Google Play, so you have to disable security checks and sideload a .apk from a random .cn site - no thanks
1. {{< ann_text 6 >}}finally, something in Network Manager that wasn't a massive buggy pain in the neck to get working!
