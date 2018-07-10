+++
date = "2018-07-10T14:34:21+12:00"
description = ""
draft = false
tags = ['Bugs', 'LVM', 'Puppet', 'Python']
title = "An annotated anthology of bugs"
topics = []

+++

A list of bugs that I have stumbled over in my travels that are fun, unusual, shocking or otherwise notable

<!--more-->

_Update, 10/07/18_

* NetworkManager (why is it always NetworkManager?) shows a super useful "device not managed" entry in the network list for every virtual interface on the system which - if you use Docker at all - means your screen will be full of useless entries: [Ubuntu bug #1458322](https://bugs.launchpad.net/ubuntu/+source/network-manager/+bug/1458322) from 2015 (!?!) has had a patch attached since January 2017, but noone seems interested in actually doing anything with it.

_Update, 19/04/17_

* NetworkManager in Ubuntu 12.10 or newer ignores DNS settings supplied by OpenVPN server after establishing a VPN connection: [Ubuntu bug #1211110](https://bugs.launchpad.net/ubuntu/+source/openvpn/+bug/1211110)

_Original Post_

* Firefox on Android does not support SNI when negotiation SSL sessions for the sync client or when fetching favicons. [Bugzilla #765064](https://bugzilla.mozilla.org/show_bug.cgi?id=765064) goes into some detail as to why this is the case, but it has been a known bug since at least 2012. No SNI support in some components of a major web browser. In ~~2016~~ 2018. Yup.

* The official APT module for Puppet doesn't correctly handle PPAs on Ubuntu Trusty or newer: [MODULES-1630](https://tickets.puppetlabs.com/browse/MODULES-1630). `add-apt-repository` is not idempotent, so before calling it puppet checks to see if the file that it creates exists. This works fine on older versions of Ubuntu, but with Trusty the path of the file changed. The result of this is `add-apt-repository` is called on every puppet run, and because of this `add-apt-repository` repeatedly comments out the repo URL that is already in the file, and adds it again to the end. For some reason, `add-apt-repository` consumes an inordinate amount of I/O bandwidth as this file grows.

* The version of LVM that ships with Ubuntu Xenial can't read cached partitions create by the LVM from Ubuntu Wily: [Ubuntu bug #1556602](https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1556602). See [Fun and Games and Xenial](/post/fun_and_games_and_xenial) for discussion about this.

* When registering for an account on the [Python Package Index](https://pypi.python.org/) you can optionally supply a GPG key, however the form will reject anything other than the 32 bit 'short' key ids, which are [very insecure](https://evil32.com/). There is a [bug report](https://github.com/pypa/pypi-legacy/issues/76) on the pypi-legacy bugtracker, where a PyPA member states that "to my knowledge nothing actually uses those keys. I'm working on a PyPI 2.0 and this is one of the things I plan on fixing in that", which is something I guess?
