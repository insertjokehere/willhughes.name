#!/bin/bash

docker build --pull -t willhughes_name .

docker run --rm -ti -v `pwd`:/mnt/data --user `id -u`:`id -g` willhughes_name /bin/bash -c "NODE_ENV=production ./node_modules/.bin/gulp"

docker build --pull -t willhughes_name:static -f Dockerfile.static .

docker run --rm -ti -p 1313:80 willhughes_name:static
