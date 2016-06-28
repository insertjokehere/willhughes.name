#!/bin/bash

docker build -t willhughes.name .

docker run -v `pwd`:/mnt/data -p 1313:1313 willhughes.name serve --bind 0.0.0.0 --buildDrafts
