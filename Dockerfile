FROM node:4.4

ENV HUGO_VER=0.15
ENV YUI_VER=2.4.8

RUN apt-get update && apt-get install -y \
		ca-certificates build-essential default-jdk python3 python3-pip \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/spf13/hugo/releases/download/v${HUGO_VER}/hugo_${HUGO_VER}_linux_amd64.tar.gz && tar -xf hugo_${HUGO_VER}_linux_amd64.tar.gz && mv hugo_${HUGO_VER}_linux_amd64/hugo_${HUGO_VER}_linux_amd64 /usr/local/bin/hugo && rm hugo_${HUGO_VER}_linux_amd64.tar.gz && rm -r hugo_${HUGO_VER}_linux_amd64

RUN wget https://github.com/yui/yuicompressor/releases/download/v${YUI_VER}/yuicompressor-${YUI_VER}.jar && mv yuicompressor-${YUI_VER}.jar /usr/local/bin/yuicompressor

RUN pip3 install pygments

RUN adduser --quiet --uid 106 --ingroup nogroup --no-create-home --shell /bin/bash jenkins

RUN mkdir -p /home/jenkins

RUN chown jenkins:nogroup -R /home/jenkins

