+++
tags = ["IoT", "Reverse Engineering"]
draft = false
description = ""
topics = []
date = "2017-07-07T21:56:28+12:00"
title = "Reverse Engineering the Orvibo S20c WiFi Switch"
slug = "reverse_engineering_orvibo_s20c"

+++

*And now for our thilling conclusion!*

<!--more-->

{{< contents >}}
{{% contentsitem index="1" title="Attempt 1: New Firmware" %}}
{{% contentsitem index="2" title="Attempt 2: Packet Capture" %}}
{{% contentsitem index="3" title="Attempt 3: Replay attacks, prior art" %}}
{{% contentsitem index="4" title="Belated Conclusion" %}}
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

{{% section index="3" title="Attempt 3: Replay attacks, prior art" %}}

*7 July 2017*

I wrote a really simple Python script that setup a socket server to listen for connections on port 10001, and configured my networks' DNS to respond to `homemate.orvibo.com` with my laptops' IP. I tried a naïve approach and responding to each packet with packets captured with Wireshark. The S20c will disconnect if it gets a packet it doesn't like, or if the server doesn't respond with a packet that it is expecting - fortunately it will reconnect after a few seconds. I managed to the the server to a state where it will accept connections from a switch, and send the right packets to complete the initial "handshake". I didn't get any further than this with that approach, the switch didn't respond to my "turn on" or "turn off" commands, and every so often would send a "heartbeat" packet, that I couldn't respond to correctly, so the switch would disconnect.

After exhausting this approach, I decided to do some research. I turned up a couple of leads: a [bug report](https://github.com/Grayda/node-orvibo/issues/11) for node-orvibo discussing integration with the (closely related) B25 switch and a [wiki page](https://github.com/Grayda/node-orvibo2/wiki/Notes-about-new-Orvibo-products) in the node-orvibo2 repo that lists research into the same switch.

The key thing from this is the comment that:

> There are two kinds of protocols used by v2 -- PK and DK. PK has encrypted JSON payload, [...] DK packets are encrypted with a separate key. Don't know if the key is the same across all Orvibo products

and a comment on the node-orvibo issue that the PK key can be found in the decompiled source of the Orvibo "Kepler" app, in `com/orvibo/lib/kepler/core/AESCoder.java`.

Looking at my packet captures, there are only two 'PK' packets - these are packets that start with `0x68 0x64 [two bytes, packet length] 0x70 0x6b` (in ASCII `hd  pk`), the initial packet that the switch sends to the server:

```
00000000  68 64 00 ba 70 6b 22 1c  99 9c 00 00 00 00 00 00   hd..pk". ........
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00   ........ ........
00000020  00 00 00 00 00 00 00 00  00 00 2e 8d fc 89 e7 bc   ........ ........
00000030  96 40 cb 68 a1 b7 08 aa  0f 65 6a 19 6f 73 a5 54   .@.h.... .ej.os.T
00000040  e2 ee 46 e0 a5 0b 64 d8  86 cd 5b 1a 87 c4 1f 66   ..F...d. ..[....f
00000050  71 37 62 68 ec 5b 66 0d  b2 c5 88 6a 05 67 13 e0   q7bh.[f. ...j.g..
00000060  d9 bc 4a 0c 2c 50 58 df  65 2d d9 b1 5b d1 7b 27   ..J.,PX. e-..[.{'
00000070  05 cd 39 fc fd 62 ae 76  c6 e2 f5 df 9d 66 3c 72   ..9..b.v .....f<r
00000080  18 72 5f c7 49 1b 42 b5  f8 85 39 3c 74 4e 6a e4   .r_.I.B. ..9<tNj.
00000090  b4 be aa 4e 73 67 65 70  fb 87 c8 cf 7e 0d 03 f7   ...Nsgep ....~...
000000A0  20 89 79 fa 64 3b bc 7c  ec 86 e1 1d 4c 3d 0c 8a    .y.d;.| ....L=..
000000B0  b5 9e 5a a3 7e 3e 59 73  5f b6                     ..Z.~>Ys _.
```

and the response from the server:

```
00000000  68 64 00 6a 70 6b 6d f4  41 22 32 65 61 62 33 65   hd.jpkm. A"2eab3e
00000010  34 35 38 30 31 63 34 34  63 32 38 66 30 36 34 30   45801c44 c28f0640
00000020  61 30 31 39 33 61 34 37  35 31 39 b3 af dc 29 32   a0193a47 519...)2
00000030  21 5f 5f 53 7b d1 11 54  17 d8 b3 74 6d 4e 65 e1   !__S{..T ...tmNe.
00000040  f4 46 f3 25 01 9c 6a 94  9e 8d ea 6d 1b b3 f6 68   .F.%..j. ...m...h
00000050  87 88 4a 29 41 82 ec e5  56 fd e0 6f 41 cb b0 6f   ..J)A... V..oA..o
00000060  37 99 95 a4 ee 70 b1 78  18 00                     7....p.x ..
```

The first two bytes for all packets are the same (`0x68 0x64`), and the next two bytes (`0x00 0xba` in the first packet, `0x00 0x6a` in the second) is the length of the full packet. The following two bytes (`0x70 0x6b`) are the packet type (ASCII `pk`). The next 4 bytes are the CRC32 of the encrypted payload (bytes 42 onwards). The next 32 bytes seem to be an ID. The first packet from the switch have it set as 32 nulls, the response from the server includes a random looking ID, and all subsequent packets include the ID. The rest of the packet is JSON, encrypted with AES-ECB, using PKCS#5. Decrypting the packet with the key from the "Kepler" app{{< ann 7 >}} yields:

```json
{'hardwareVersion': 'v1.0.0', 'modelId': '56d124ba95474fc98aafdb830e933789', 'serial': 1, 'softwareVersion': 'v2.0.6', 'language': 'chinese', 'cmd': 0}
```

from the switch and

```json
{'status': 0, 'key': '...', 'cmd': 0, 'serial': 1}
```

from the server. The value of `key` is used as the encryption/decryption key for all subsequent 'DK' packets (packets with bytes 5 and 6 set to `0x64 0x6b`, ASCII `dk`)

I've put the script I wrote to do the decryption, as well as a stream of packet captures and the decoded version in [a github repo](https://github.com/insertjokehere/homemate-bridge/tree/master/research)

Next steps:

* Rewrite the naïve script to decode packets from the switch and build responses using the encryption scheme

{{% section index="4" title="Belated Conclusion" %}}

*10 April 2019*

So I mostly figured out how the switch works - turns out once you crack the encryption, the protocol isn't very complicated. I've written a mostly-functional [homemate-bridge](https://github.com/insertjokehere/homemate-bridge) Python script that pretends to be the Orvibo server and advertises the switch to HomeAssistant over MQTT. The script _works_, but needs a bit of a clean up:

* The code is **gross**. I wrote this in a hurry, before I knew about asyncio. Ideally it needs to be scrapped and rewritten using an AsyncIO DatagramProtocol server, and an asyncio-compatible MQTT client
* I wrote the [python-hassdevice](https://github.com/insertjokehere/python-hassdevice) library to provide a way to make it easier to write python scripts that connect to HomeAssistant over MQTT. Ironically, using the library has made maintainting the bridge _harder_; the abstraction is too ridgid, and doesn't do what I need it to. Fixing bugs is painful because I have to tweak code in two repos and re-deploy
* There isn't any proper documentation about the bits of the protocol I figured out
* There is a long-standing bug where if the MQTT server restarts I have to restart the bridge and all the physical switches, which is super annoying

All-in-all, I am proud of what I achieved in this project:

* I made a thing _that works_. Even if I never get around to fixing up the rough edges, it works and I use it. Win.
* Other people seem to be using it as well - I've had several people asking questions on the Github issue tracker. One person even found that it seems to work with a different model switch that supports energy monitoring, and has figured out how to add support for that to the bridge

So thats it. I made a thing, I learnt a lot, I'm not super great at documenting my work.

_I really hope noone was waiting two years for the thrilling conclusion to this tale…_

{{% galleryinit %}}

#### Notes

1. {{< ann_text 1 >}}~ $20NZD off AliExpress, compared to the $70 for a Belkin-branded device that does the same thing
1. {{< ann_text 2 >}}install app from Google Play, give it WiFi creds, done
1. {{< ann_text 3 >}}even when the internet goes away!
1. {{< ann_text 4 >}}those plastic molding forms are expensive after all
1. {{< ann_text 5 >}}which isn't on Google Play, so you have to disable security checks and sideload a .apk from a random .cn site - no thanks
1. {{< ann_text 6 >}}finally, something in Network Manager that wasn't a massive buggy pain in the neck to get working!
1. {{< ann_text 7 >}}Which I'm not going to post here until I'm sure there won't be legal consequences
