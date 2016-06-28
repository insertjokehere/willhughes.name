+++
date = "2016-06-09T12:29:14+12:00"
description = ""
draft = true
tags = []
title = "bugs"
topics = []

+++

An annotated list of fun bugs

* Firefox on Android does not support SNI when negotiation SSL sessions for the sync client or when fetching favicons. [Bugzilla #765064](https://bugzilla.mozilla.org/show_bug.cgi?id=765064) goes into some detail as to why this is the case, but it has been a known bug since at least 2012. No SNI support in some components of a major web browser. In 2016. Yup.

* The official APT module for Puppet doesn't correctly handle PPAs on Ubuntu Trusty or newer: [MODULES-1630](https://tickets.puppetlabs.com/browse/MODULES-1630)

* The LVM that ships with Ubuntu Xenial can't read cached partitions create by Ubuntu Wily: [Ubuntu bug #1556602](https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1556602). See [Fun and Games and Xenial](/post/fun_and_games_and_xenial) for discussion about this
