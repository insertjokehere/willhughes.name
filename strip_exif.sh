#!/bin/bash

docker build -t willhughes.name .

docker run --rm -ti -v $(dirname $(realpath $1)):/tmp/img --user `id -u`:`id -g` willhughes.name exiftool -gps:all= -xmp-exif:all= /tmp/img/$(basename $1)
