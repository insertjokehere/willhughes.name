#!/bin/bash

docker build -t willhughes.name .

docker run --rm -ti -v `pwd`:/mnt/data --user `id -u`:`id -g` -p 1313:1313 willhughes.name /bin/bash -c "cd /mnt/data && gulp && hugo serve --bind 0.0.0.0 --buildDrafts"
