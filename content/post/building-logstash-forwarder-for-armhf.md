+++
date = "2014-10-02T16:47:44+13:00"
draft = false
title = "Building logstash-forwarder v0.3.0 for armhf"
aliases = [ "/blog/building-logstash-forwarder-for-armhf/" ]
tags = [ "Go", "Logstash", "Cross-compiling" ]
+++

*(or, I really should learn more about this 'Go' thing)*

The wonders of Logstash is a subject for a future blog post, but in the mean time the following are my notes for building logstash-forwarder to run on an armhf device (specifically, a Raspberry Pi, running Raspbian). These instructions assume a modern Linux machine (I run Ubuntu 14.04).

<!--more-->

**UPDATE: These instructions work for logstash-forwarder 0.3.0, not the latest 0.4.0. I will try to update them for 0.4.0 at some point**

### Install Go from source{{< ann 1 >}}.

This is not nearly as intimidating as it sounds, and shouldn't take much longer than 10 minutes on a moderately powerful system. You will probably require the usual build-essential stuff to make this work. Download and build go itself

{{< highlight bash >}}
hg clone https://code.google.com/p/go
cd go/src
./all.bash
{{< /highlight >}}

Then grab the cross-compile scripts off GitHub, and build for all supported platforms (or just Linux/arm if you are in a serious hurry)

{{< highlight bash >}}
git clone git://github.com/davecheney/golang-crosscompile.git
source golang-crosscompile/crosscompile.bash
go-crosscompile-build-all
{{< /highlight >}}

Add your freshly minted go to your path

{{< highlight bash >}}
export PATH=`pwd`/bin:$PATH
{{< /highlight >}}

### Clone the logstash-forwarder source off GitHub

{{< highlight bash >}}
git clone https://github.com/elasticsearch/logstash-forwarder.git
git checkout e12e3415f2c0baf1519419cca741f4a02e47ea7b</pre>
{{< /highlight >}}

### Edit the Makefile{{< ann 2 >}}

1. Comment out go-check target ~L21, this target checks which version of Go you are using by running 'go version' and grepping for go1.3, but because we are running a version of Go compiled from source, it doesn't have this version stamp
2. Add '-a armhf' to the call to fpm in the 'rpm' and 'deb' targets (L49) so the resulting packages declare the right platform

### Build the package

Logstash-forwarder uses <a href="https://github.com/jordansissel/fpm">fpm</a> to package up the compiled program, so install it, then:

{{< highlight bash >}}
GOOS=linux GOARCH=arm make deb
{{< /highlight >}}

To compile logstash-forwarder and build a Debian package{{< ann 3 >}}


#### Notes

1. {{< ann_text 1 >}}Based off Dave Cheney's instructions, <a href="http://dave.cheney.net/2013/07/09/an-introduction-to-cross-compilation-with-go-1-1">found here</a>
2. {{< ann_text 2 >}}Or apply the diff from [here](/files/logstash-forwarder/Makefile.diff)
3. {{< ann_text 3 >}}In theory 'make rpm' should build a rpm, but I haven't tested this
