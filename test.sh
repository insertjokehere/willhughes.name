#!/bin/bash

docker build -t willhughes.name .

docker run -v `pwd`:/mnt/data -v $HOME:/home --user `id -u`:`id -g` --entrypoint="gulp" willhughes.name

docker run -v `pwd`/public:/mnt/data --user `id -u`:`id -g` -p 1313:1313 --entrypoint="/usr/bin/python" willhughes.name -m SimpleHTTPServer 1313
