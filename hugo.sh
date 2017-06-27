#!/bin/bash

docker build -t willhughes.name .

docker run --rm -ti -v `pwd`:/mnt/data --user `id -u`:`id -g` willhughes.name hugo $@
