+++
date = "2017-01-23T14:49:36+13:00"
description = ""
draft = true
tags = []
title = "hobbies"
topics = []

+++

I can't believe its taken me as long as it has to figure this out.

<!--more-->

Its a bit obvious when I say it, but:

### Have a hobby that doesn't come down to fighting Entropy

Let me back up slighty.

Both of the things that I do in my spare time - maintaining a tropical fish tank and various computer related hackery - essentially boil down to a never-ending fight against Entropy. Fish keeping is a fairly obvious example of this; a tank is a closed system, and over time you introduce polutants into the system by the way of food (and by extension fish-byproducts) and energy in the form of light that work to destabalize the system. You perform maintanence on the tank to ensure that it doesn't fall off its 'plateau of stability' or everything will die and all your hardwork will be undone. You are pileing dirt up against a boulder on a steep hill, hopeing that it doesn't rain lest the water wash away the stability you are trying to construct. It is a lot like gardening{{< ann 1 >}} in that no matter how much people tell you the garden looks great, all you can see is the patch of weeds poking up through the dirt in the back corner.

This characterization probably says more about me as a person than I'm entirely comfortable with.

The way I hack on computers for fun ends up taking a similar turn as well some times. I've spent years{{< ann 2 >}} building up a set of tools that I use daily. Take this blog - just the act of posting a new entry to the internet involves running a set of scripts to build and upload the content, which are run by another set of scripts controlled by my Jenkins instance, which is installed by a set of Puppet scripts that configure an Ubuntu VM correctly, which runs on top of Openstack, which is configured by the same set of Puppet scripts running on an actual bare-metal Ubuntu instance, running on an IBM server that I brought and upgraded and tuned and got mad at the RAID controller when I thought it was corrupting VMs at random. That server needs to talk to the internet, which involves a switch that I have to have configured correctly, and a router that needs to be working right and my ISPs router and ONT that do whatever the hell they want. These are bricks, stacked on top of each other. I've gotten pretty good over the years of not having them all fall over at once, and even when they do they usually don't break, and I can just stack them back up again. Tools like Puppet and Git and a robust backup scheme have made that part less painful but no matter what I do, the system is still always in a state of decline.

Computer systems don't tend to deteriorate in the same constant analog way that physical systems do, they fail digitally. Data corruption because an LVM pool filled up and you didn't see the alert because you accidently disabled the notification setting when you configured things three months ago, which means you spend two consecutive weekends restoring from backup, then restoring again the next week because you didn't actually fix the problem. Random lockups and crashes because of a bad RAM module. A package that updated and changed the meaning of a configuration option so it no longer works quite the same as you intended it to. The never ending treadmill of security patching.

In general I _enjoy_ doing these things; for reasons I've not been able to explain and which seem to be entirely opaque to everyone else, I by and large _like_ fighting Entropy. Pushing the boulder to the top of that (increasingly contrived as I continue to write) metaphorical mountain is rewarding. I get joy from watching my tank, much more so than the professionally maintained tanks in stores{{< ann 3 >}} _because_ of the work I put in. But I also get frustration - the water quality in my tank isn't as good as it could be, and with the bright summer sun I'm getting algae blooms in the form of diatoms, which are turning the glass a cloudy brown colour. My tank looked great in June, why can't it look like that all the time? In an ideal world I would spend the hour or so a week that it takes to do water changed and scrape the glass and change the filters, and if I kept that up for months the water would clear up and the algae would go away. But I don't have time for that, at least not consistantly. With everything else going on in my life, most of the time I have to choose what I want to do with the handful of free hours a week. Given the choice between hauling my fish tank boulder back to the top of the same mountain I've been looking at for the last six months, or finding a new mountain to haul my computer boulder up to, its hard to choose to do the same thing over again, even knowing how much better I'm going to feel looking at my tank for the next week.

Entropy isn't something you can cheat, it is law in most fundemental physical sense{{< ann 4 >}}. There are ways to work around it, plateaus of stability where you can pause, but inevitably physics dictates that systems tend towards chaos and that they find their lowest energy state. My mistake was making both of the things I do to relax be maintaining systems, without really understanding that doing so is a fight against the nature of the universe - which leads my back to my original point. I need a hobby that isn't fighting entropy, something to do that isn't going to deteriorate if I stop working at it for weeks on end.

I stumbled on a Youtube video showing some basic DIY leatherworking. That looks kinda cool.

#### Notes

1. {{< ann_text 1 >}} or so I infer, as anyone familiar with the state of my garden can attest
1. {{< ann_text 2 >}} Literal years. The Git repo that hold my Puppet manifests had its first commit in October 2012, and has seen 3721 commits since
1. {{< ann_text 3 >}} that for some reason seem to be torn down and rebuilt every few weeks…
1. {{< ann_text 4 >}} I'm capitalizing Entropy throughout this post. It seems appropriate for a fundemental force that drives all things.
