FROM node:4.4

ENV HUGO_VER=0.16

RUN apt-get update && apt-get install -y \
		ca-certificates build-essential python3 python3-pip linkchecker supervisor \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/spf13/hugo/releases/download/v${HUGO_VER}/hugo_${HUGO_VER}_linux-64bit.tgz && tar -xf hugo_${HUGO_VER}_linux-64bit.tgz && mv hugo /usr/local/bin/hugo && rm hugo_${HUGO_VER}_linux-64bit.tgz

RUN pip3 install pygments

RUN adduser --quiet --uid 106 --ingroup nogroup --no-create-home --shell /bin/bash jenkins

RUN mkdir -p /home/jenkins

RUN chown jenkins:nogroup -R /home/jenkins

WORKDIR /mnt/data

COPY docker/supervisor.conf /etc/supervisor/supervisord.conf
COPY docker/bin/* /usr/local/bin/

EXPOSE 1313
