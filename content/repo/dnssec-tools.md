+++
date = "2016-03-07T11:20:12+13:00"
description = ""
draft = false
tags = []
title = "dnssec-tools"
topics = []
distributions = ["wheezy"]
architectures = ["amd64"]
component = "backports"
version = "2.1-1"
+++

**I am in the process of moving my DNS master to PowerDNS, so this package is unlikely to be updated, and may be removed in the future**

[dnssec-tools](http://www.dnssec-tools.org/){{< ann 1 >}}</a> 2.1 backported from Sid. I was having issues with 1.13 as packaged in Wheezy where it would fail to parse serial numbers in SOA records for some reason, which caused odd failures of rollerd{{< ann 2 >}}. The source that this is built from is available in my [git repo](http://git.willhughes.name/dnssec-tools/)

#### Notes

1. {{< ann_text 1 >}}rollerd, zonesigner, donuts etc
2. {{< ann_text 2 >}}which is *not* something you want failing silently
