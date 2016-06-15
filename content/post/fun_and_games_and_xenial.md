+++
date = "2016-06-15T20:51:16+12:00"
description = ""
draft = true
tags = []
title = "fun_and_games_and_xenial"
topics = []

+++

  PV         VG     Fmt  Attr PSize   PFree  
  /dev/md0   hactar lvm2 a--  465.63g 114.63g
  /dev/sda3  hactar lvm2 a--  111.39g 404.00m

  LV   VG     Attr       LSize   Pool         Origin       Data%  Meta%  Move Log Cpy%Sync Convert
  home hactar Cwi-aoC--- 350.00g [home_cache] [home_corig] 21.28  0.80            0.00            
  root hactar -wi-ao----  30.00g                                                                  
  swap hactar -wi-ao----  16.00g

vgcfgrestore -f /etc/lvm/archive/hactar_00005-1440886391.vg hactar
lvchange -a y hactar/home --activationmode partial
