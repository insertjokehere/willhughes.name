#!/bin/bash

docker build -t willhughes.name .

docker run -v `pwd`:/mnt/data -v $HOME:/home --user `id -u`:`id -g` --entrypoint="gulp" willhughes.name

docker run -v `pwd`:/mnt/data -p 1313:1313 willhughes.name serve --bind 0.0.0.0 --buildDrafts
