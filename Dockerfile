FROM node:6

# datasource=github-releases depName=gohugoio/hugo
ENV HUGO_VER=v0.87.0

RUN apt-get update && apt-get install -y \
		ca-certificates build-essential python3 python3-pip linkchecker supervisor graphicsmagick-imagemagick-compat graphicsmagick libimage-exiftool-perl \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN export V=$(echo ${HUGO_VER} | egrep -o '[0-9]+\.[0-9]+\.[0-9]+') \
	&& wget -q https://github.com/gohugoio/hugo/releases/download/v${V}/hugo_${V}_Linux-64bit.tar.gz && tar -xf hugo_${V}_Linux-64bit.tar.gz && mv hugo /usr/local/bin/hugo && rm hugo_${V}_Linux-64bit.tar.gz

RUN pip3 install pygments

WORKDIR /mnt/data

COPY docker/supervisor.conf /etc/supervisor/supervisord.conf
COPY docker/bin/* /usr/local/bin/

EXPOSE 1313
