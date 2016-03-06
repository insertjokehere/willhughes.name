+++
date = "2014-10-02T16:47:44+13:00"
draft = true
title = "Building logstash-forwarder v0.3.0 for armhf"
+++

**UPDATE: These instructions work for logstash-forwarder 0.3.0, not the latest 0.4.0. I will try to update them for 0.4.0 at some point**

*(or, I really should learn more about this 'Go' thing)*

The wonders of Logstash is a subject for a future blog post, but in the mean time the following are my notes for building logstash-forwarder to run on an armhf device (specifically, a Raspberry Pi, running Raspbian). These instructions assume a modern Linux machine (I run Ubuntu 14.04).

### Install Go from source[[1](#1-an-1)].

This is not nearly as intimidating as it sounds, and shouldn't take much longer than 10 minutes on a moderatly powerful system. You will probably require the usual build-essential stuff to make this work. Download and build go itself

    hg clone https://code.google.com/p/go
    cd go/src
    ./all.bash

Then grab the crosscompile scripts off github, and build for all supported platforms (or just linux/arm if you are in a serious hurry)

    git clone git://github.com/davecheney/golang-crosscompile.git
    source golang-crosscompile/crosscompile.bash
    go-crosscompile-build-all


Add your freshly minted go to your path

    export PATH=`pwd`/bin:$PATH

### Clone the logstash-forwarder source off github

    git clone https://github.com/elasticsearch/logstash-forwarder.git
    git checkout e12e3415f2c0baf1519419cca741f4a02e47ea7b</pre>

### Edit the Makefile[[2](#1-an-2)]:

1. Comment out go-check target ~L21, this target checks which version of Go you are using by running 'go version' and grepping for go1.3, but because we are running a version of Go compiled from source, it doesn't have this version stamp
2. Add '-a armhf' to the call to fpm in the 'rpm' and 'deb' targets (L49) so the resulting packages declare the right platform

### Build the package

Logstash-forwarder uses <a href="https://github.com/jordansissel/fpm">fpm</a> to package up the compiled program, so install it, then:

    GOOS=linux GOARCH=arm make deb

To compile logstash-forwarder and build a Debian package[[3](#1-an-3)]


#### Notes

1. <a name="1-an-1"></a>Based off Dave Cheney's instructions, <a href="http://dave.cheney.net/2013/07/09/an-introduction-to-cross-compilation-with-go-1-1">found here</a>
2. <a name="1-an-2"></a>Or apply the diff from <a href="http://git.willhughes.name/blogSnippets/blob/master/blog/2014/10/02/building-logstash-forwarder-for-armhf/Makefile.diff">here</a>
3. <a name="1-an-3"></a>In theory 'make rpm' should build a rpm, but I haven't tested this
