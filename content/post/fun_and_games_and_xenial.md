+++
date = "2016-06-16T11:58:12+12:00"
description = ""
draft = false
tags = ["LVM", "Ubuntu", "Bugs"]
title = "Fun and Games and Xenial"
topics = []

+++

I have just finished upgrading my main workstation at home ('hactar') from Ubuntu 15.10 'Wily' to Ubuntu 16.04 'Xenial' which, after 3 days of trying, turned out to be one of the most involved upgrades I have ever undertaken. At the end of the day this was because of a bug{{< ann 1 >}} in the LVM2 package on Xenial, and was a bit challenging to fix without just nuking the system and starting again.

<!--more-->

This should go without saying, but in the course of this post I'm going to be describing some fairly hairy things you can do if you find yourself stuck in the situation I was, and I make no promises at all that what worked for me isn't going to wipe all your drives and cause sand to start leaking out of your Ethernet card. Backup your data as soon as you have the chance.

### Setup

Before diving into the weeds of the mess I got my system into, its worth describing how I've configured my storage devices on this machine. Hactar has three disk drives; a 120GB SSD{{< ann 2>}} that stores the EFI system partition, with the rest of the disk formatted as an LVM physical volume, and a pair of 500GB spinning rust drives configured in a RAID 0 mirror{{< ann 3 >}} formatted as a physical volume.

Both of these physical volumes are part of the '`hactar`' volume group, and all of the data for the system is stored on these drives. The SSD stores the root and swap partitions, with the rest of the disk set aside as a cache for the home partition, which is stored on the spinning rust{{< ann 4 >}}. Disk caching was introduced in the version of LVM that shipped with Ubuntu 14.10 'Vivid', and adds integration with the `dm-cache` module that ships with the Linux kernel. Put simply, LVM cache lets you use a small, fast disk as a cache for a large, slower disk. The most commonly accessed blocks on the large disk are stored on the fast disk, so reads for those blocks don't need to wait for the slow disk, and I've configured it so that writes to cached blocks are written to the fast disk first, then copied back to the slow disk when the disk is idle{{< ann 5 >}}.

The output of `pvs` looks like:

```
  PV         VG     Fmt  Attr PSize   PFree
  /dev/md0   hactar lvm2 a--  465.63g 114.63g
  /dev/sda3  hactar lvm2 a--  111.39g 404.00m
```

And the output of `lvs` looks like:

```
  LV   VG     Attr       LSize   Pool         Origin       Data%  Meta%  Move Log Cpy%Sync Convert
  home hactar Cwi-aoC--- 350.00g [home_cache] [home_corig] 21.28  0.80            0.00            
  root hactar -wi-ao----  30.00g                                                                  
  swap hactar -wi-ao----  16.00g
```

### Failed upgrade

Upgrading from Wily to Xenial went as normal, but after rebooting I was dropped into an emergency shell immediately after EFI GRUB, with the super helpful error message:

```
LV home has invalid cache's feature flag.
LV home is missing cache policy name.
Internal error: LV segments corrupted in home.
```

From what I can gather from the [Ubuntu bug report](https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1556602), the version of LVM that shipped with Wily writes the metadata that associates the cache volume with the backing volume in a way that isn't seen as valid by the LVM in Xenial, so when Xenial boots up LVM can't load the volume group, so no root disk, and an emergency shell.

Getting past this error wasn't actually too hard. I booted a Wily live USB, and removed the cache pool:
```
lvremove hactar/home_cache
```

### Deeper errors

Once I had removed the cache volume, I rebooted back into the main system. The Ubuntu splash screen hung around for a lot longer than normal - at least it can read the root partition now - but eventually dropped me into an emergency shell again, this time one of the SystemD 'Give root password for maintenance or Control-D to continue' types - because it couldn't mount one of the file systems in `fstab`: my `home` volume.  Once I logged in, I found LVM was in a really odd state. It could see `/dev/md0`, running `pvscan -vv` and `pvdisplay` showed that it had detected the disk, but it was marked as 'missing' in the `pvs` output:

```
  PV         VG     Fmt  Attr PSize   PFree
  /dev/md0   hactar lvm2 a-m  465.63g 114.63g
  /dev/sda3  hactar lvm2 a--  111.39g 404.00m
```

Because LVM thought that `/dev/md0` was missing, it marked the `home` logical volume as only being partially available, and doesn't make it active. This is weird, and I'm not really sure why it happened. The obvious answer would be something to do with the way the disk metadata was written when I removed the cache volume that the LVM in Xenial didn't like, but I don't really have anything to support this.

After trying several times to get LVM to recognize `/dev/md0`, I found that I could use `lvchange` to force LVM to activate the `home` volume:
```
lvchange -a y hactar/home --activationmode partial
```

I said it at the top of this article, but I will repeat it again: Doing this is very dangerous. If `/dev/md0` was actually missing, I could have caused significant damage to my file system. The smart thing for me to do at this point would have been to reboot back into the Wily live image and backup the data from there.

With the volume active, I was able to mount it and found all the data intact. A few hours worth of `rsync` later, and I had a complete backup{{< ann 6 >}}.

I tried rebooting a couple of times in the vain hope that LVM would suddenly realize that it was actually able to read the disk, but to no avail. After a bit of Googling I realized that the only way to remove the 'missing' flag from `/dev/md0` was to restore the disk metadata from backup. Fortunately, LVM automatically makes backups of the metadata of all volume groups it knows about in `/etc/lvm/archive`. The newest backup ('00006) was made after `/dev/md0` was declared missing, as reflected in the 'flags' option in the metadata backup file:

```
pv2 {
    device = "/dev/md0"     # Hint only
    status = ["ALLOCATABLE"]
    flags = ["MISSING"]
    ...
}
```

The second-newest backup didn't have this flag set, so that was the config I restored using `vgcfgrestore`:

```
vgcfgrestore -f /etc/lvm/archive/hactar_00005-1440886391.vg hactar
```

One more reboot, and everything came up as expected. Next job, upgrade my laptop as well. Urgh.

### The Laptop

*Update 22/6/16*: Upgrading my laptop 'agrajag'{{< ann 7 >}} ended up being a lot less of a saga than my desktop - although not without issues. I hadn't setup caching so I didn't run into the same issues as with my desktop, just new and exciting problems:

* My laptop is affected by [Ubuntu bug #1568604](https://bugs.launchpad.net/ubuntu/+source/xserver-xorg-video-intel/+bug/1568604), so I have to switch to a TTY and back{{< ann 8>}} to get a cursor after logging in when my laptop comes back from suspend, which is tedious
* After enabling caching on my laptop, I got dropped into an emergency shell after reboot. LVM hadn't activated my `home` LV, and when I activated it manually, I got an interesting error:

`/usr/sbin/cache_check: execvp failed: No such file or directory`

Turns out you need to install the `thin-provisioning-tools` package to use LVM cache, something that I vaguely remember running into when setting up hactar, but which isn't mentioned anywhere in the documentation


#### Notes

1. {{< ann_text 1>}} [Ubuntu bug #1556602](https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1556602)
2. {{< ann_text 2>}} `/dev/sda` in the diagrams
3. {{< ann_text 3>}} `/dev/md0`
4. {{< ann_text 4>}} This whole crazy scheme could have been avoided if I had a pair of large SSDs I could setup as RAID 0. Donations gratefully accepted.
5. {{< ann_text 5>}} This is called 'write-back' caching. It is also possible to configure LVM cache to use a 'write-through' scheme where writes go directly to the slow disk. This is safer - if the fast disk fails before data has been copied back to the slow disk, you will loose it - but has a performance penalty, but I consider the risk of loss in 'write-back' to be acceptable. 'write-through' is designed more for systems that are using volatile storage systems like battery-backed RAM disks as cache. If power was to go out unexpectedly, you would loose the cache volume and everything that didn't get written back. With an SSD if I loose power when I reboot the data is still there, and LVM can finish its write-back.
6. {{< ann_text 6>}} Yes, I do make regular backups of all the critical parts of my system, I'm going through this exercise to try and avoid having to replace the non-critical stuff that I don't backup because of storage limits. As I said before, Donations gratefully accepted
7. {{< ann_text 7>}} Have you spotted the theme yet?
8. {{< ann_text 8>}} Ctrl+Alt+F1, Ctrl+Alt+F7
