+++
date = "2016-03-07T11:19:55+13:00"
description = ""
draft = false
tags = []
title = "libpam-google-authenticator"
topics = []
distributions = ["wheezy", "trusty"]
architectures = ["armhf", "amd64"]
component = "main"
version = "20130529-2"
+++

This package is the [Google Authenticator](https://code.google.com/p/google-authenticator/") libpam module that allows you to require a [TOTP](https://tools.ietf.org/html/rfc6238) or [HOTP](https://tools.ietf.org/html/rfc4226) one-time passwords as a form of second factor authentication. This package is built for amd64 and armhf.


My use case for this is for allowing password login only in combination with a TOTP code, in addition to the regular key-based login. To do this, install the package then edit /etc/pam.d/sshd and add

    auth   required  pam_google_authenticator.so

under '@include common-account' (~L20), then run

    google-authenticator

to generate secret keys. The source that this is built from is available in my [git repo](http://git.willhughes.name/google-authenticator/)
