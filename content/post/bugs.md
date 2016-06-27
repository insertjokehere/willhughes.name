+++
date = "2016-06-09T12:29:14+12:00"
description = ""
draft = true
tags = []
title = "bugs"
topics = []

+++

An annotated list of fun bugs

Firefox on Android does not support SNI when negotiation SSL sessions for the sync client or when fetching favicons. [Bugzilla #765064](https://bugzilla.mozilla.org/show_bug.cgi?id=765064) goes into some detail as to why this is the case, but it has been a known bug since at least 2012. No SNI support in some components of a major web browser. In 2016. Yup.

