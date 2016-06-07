+++
architectures = []
component = "_header"
date = "2016-03-13T09:28:22+13:00"
distributions = []
title = "header"
version = ""
layout = "header"
draft = false
+++

These are Debian (and for the most part Ubuntu) packages that I have built for my own use. Some of them are backports; packages copied from the Jessie or Sid repositories that can be installed directly on Wheezy, while others are modified from upstream or not available at all in the official repositories. The repository can be browsed directly at <a href="http://repo.hhome.me/apt/">http://repo.hhome.me/apt/</a> or added as a system repository by doing:

{{< highlight bash >}}
curl http://repo.hhome.me/apt/keyring.gpg | sudo apt-key add -
echo "deb http://repo.hhome.me/apt ${distro} ${component}" > hhome.list
echo "deb-src http://repo.hhome.me/apt ${distro} ${component}" >> hhome.list
sudo mv hhome.list /etc/apt/sources.list.d
sudo apt-get update
{{< /highlight >}}

Substituting ${distro} and ${component} as appropriate
