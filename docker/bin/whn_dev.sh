#!/bin/bash

export HOME=/mnt/data

whn_install_deps.sh /mnt/data
supervisord -n
