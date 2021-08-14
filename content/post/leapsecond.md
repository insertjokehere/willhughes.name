+++
date = "2021-08-14T23:19:54+13:00"
draft = false
tags = ["Not Strictly Useful", "Projects"]
topics = []
description = ""
title = "The most vital piece of information to know in 2021"
slug = "leapsecond"
+++

I've always been facinated by clocks, and by extension the time systems they track. For modern clocks, this means UTC, and it turns out that UTC is being kinda weird right now.

<!--more-->

Most clocks you deal with day-to-day track UTC - a "civil" time scale - which is designed to track time for use by humans - as opposed to UT1 which tracks the passage of time by measuring the rotation of the Earth with respect to distant stars.

As it turns out, human notions like weeks and years and round numbers mean that every 4-ish years Feburary gains an extra day, and because _nothing_ in nature is actually stable or consistent, UTC needs to be adjusted using a "leap second" every few years. Historically, leap seconds have always involved adding a second - a "positive" leap - but for some reason it doesn't look like this will continue to be the case.

{{< tweet 1386838657093586944 >}}

Like Tony, I'm pretty interested in what is going on here, and if I can predict when the next leap second will occur, and what it might look like. IERS [publishes](https://www.iers.org/IERS/EN/Publications/Bulletins/bulletins.html) "Bulletin A" every week with the latest set of observations and predictions for the future. The effect is best seen in the plot of the UT1-UTC difference

![Plot showing UT1-UTC being unstable over the past year]({{< post_img "BulletinA_All-UT1-UTC.png" >}})<small>Plot showing the difference between UT1 and UTC as at 14/08/21 - [source IERS](https://datacenter.iers.org/singlePlot.php?plotname=BulletinA_All-UT1-UTC&id=6)</small>

Safe to say I got thoroughly nerd-sniped. I put together a small site to keep updating the prediction when a new version of Bulletin A is published using a domain I happened to have lying around [565851109.xyz](https://565851109.xyz/). Truely a domain worth memorizing, and the most vital piece of information to have at your fingertips.

Source code is on [Github](https://github.com/insertjokehere/leap-second-prediction/), along with some more detail about how the predictions are made.