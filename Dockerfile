FROM node:6

ENV HUGO_VER=0.55.0

RUN apt-get update && apt-get install -y \
		ca-certificates build-essential python3 python3-pip linkchecker supervisor graphicsmagick-imagemagick-compat graphicsmagick libimage-exiftool-perl \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN wget -q https://github.com/spf13/hugo/releases/download/v${HUGO_VER}/hugo_${HUGO_VER}_Linux-64bit.tar.gz && tar -xf hugo_${HUGO_VER}_Linux-64bit.tar.gz && mv hugo /usr/local/bin/hugo && rm hugo_${HUGO_VER}_Linux-64bit.tar.gz

RUN pip3 install pygments

WORKDIR /mnt/data

COPY docker/supervisor.conf /etc/supervisor/supervisord.conf
COPY docker/bin/* /usr/local/bin/

EXPOSE 1313
