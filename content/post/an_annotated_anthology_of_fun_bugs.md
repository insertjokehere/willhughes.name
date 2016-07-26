+++
date = "2016-06-09T12:29:14+12:00"
description = ""
draft = true
tags = ['Bugs']
title = "An annotated anthology of fun bugs"
topics = []

+++

A list of bugs that I have stumbled over in my travels that are fun, unusual or otherwise notable

<!--more-->

* Firefox on Android does not support SNI when negotiation SSL sessions for the sync client or when fetching favicons. [Bugzilla #765064](https://bugzilla.mozilla.org/show_bug.cgi?id=765064) goes into some detail as to why this is the case, but it has been a known bug since at least 2012. No SNI support in some components of a major web browser. In 2016. Yup.

* The official APT module for Puppet doesn't correctly handle PPAs on Ubuntu Trusty or newer: [MODULES-1630](https://tickets.puppetlabs.com/browse/MODULES-1630). `add-apt-repository` is not idempotent, so before calling it puppet checks to see if the file that it creates exists. This works fine on older versions of Ubuntu, but with Trusty the path of the file changed. The result of this is `add-apt-repository` is called on every puppet run, and because of this `add-apt-repository` repeatedly comments out the repo URL that is already in the file, and adds it again to the end. For some reason, `add-apt-repository` consumes an inordinate amount of I/O bandwidth as this file grows.

* The version of LVM that ships with Ubuntu Xenial can't read cached partitions create by the LVM from Ubuntu Wily: [Ubuntu bug #1556602](https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1556602). See [Fun and Games and Xenial](/post/fun_and_games_and_xenial) for discussion about this.

* When registering for an account on the [Python Package Index](https://pypi.python.org/) you can optionally supply a GPG key, however the form will reject anything other than the 32 bit 'short' key ids, which are [very insecure](https://evil32.com/). There is a [bug report](https://github.com/pypa/pypi-legacy/issues/76) on the pypi-legacy bugtracker, where a PyPA member states that "to my knowledge nothing actually uses those keys. I'm working on a PyPI 2.0 and this is one of the things I plan on fixing in that", which is something I guess?
