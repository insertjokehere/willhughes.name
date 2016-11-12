FROM node:6

ENV HUGO_VER=0.17

RUN apt-get update && apt-get install -y \
		ca-certificates build-essential python3 python3-pip linkchecker supervisor \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/spf13/hugo/releases/download/v${HUGO_VER}/hugo_${HUGO_VER}_Linux-64bit.tar.gz && tar -xf hugo_${HUGO_VER}_Linux-64bit.tar.gz && mv hugo_${HUGO_VER}_linux_amd64/hugo_${HUGO_VER}_linux_amd64 /usr/local/bin/hugo && rm hugo_${HUGO_VER}_Linux-64bit.tar.gz

RUN pip3 install pygments

RUN adduser --quiet --uid 116 --ingroup nogroup --no-create-home --shell /bin/bash jenkins

RUN mkdir -p /home/jenkins

RUN chown jenkins:nogroup -R /home/jenkins

WORKDIR /mnt/data

COPY docker/supervisor.conf /etc/supervisor/supervisord.conf
COPY docker/bin/* /usr/local/bin/

EXPOSE 1313
