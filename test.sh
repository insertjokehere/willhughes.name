#!/bin/bash

docker build -t willhughes.name .

docker run --rm -ti -v `pwd`:/mnt/data --user 106:106 -p 1313:1313 willhughes.name /bin/bash -c "cp -r /mnt/data/* /home/jenkins && whn_install_deps.sh /home/jenkins && cd /home/jenkins && NODE_ENV=production ./node_modules/.bin/gulp && cd public && python -m SimpleHTTPServer 1313"
