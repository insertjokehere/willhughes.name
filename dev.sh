#!/bin/bash

docker build -t willhughes.name .

docker run --rm -ti -v `pwd`:/mnt/data --user `id -u`:`id -g` -p 0.0.0.0:1313:1313 willhughes.name /usr/local/bin/whn_dev.sh
