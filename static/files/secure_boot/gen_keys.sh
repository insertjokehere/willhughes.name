#!/bin/bash
# Copyright (c) 2015 by Roderick W. Smith
# Modified by Will Hughes
# Licensed under the terms of the GPL v3

echo -n "Enter a Common Name to embed in the keys: "
read -r NAME

openssl req -new -x509 -newkey rsa:2048 -subj "/CN=$NAME PK/" -keyout PK.key \
        -out PK.crt -days 3650 -nodes -sha256
openssl req -new -x509 -newkey rsa:2048 -subj "/CN=$NAME KEK/" -keyout KEK.key \
        -out KEK.crt -days 3650 -nodes -sha256
openssl req -new -x509 -newkey rsa:2048 -subj "/CN=$NAME DB/" -keyout DB.key \
        -out DB.crt -days 3650 -nodes -sha256

openssl x509 -in PK.crt -out PK.cer -outform DER
openssl x509 -in KEK.crt -out KEK.cer -outform DER
openssl x509 -in DB.crt -out DB.cer -outform DER

GUID=$(python -c 'import uuid; print str(uuid.uuid1())')

echo "${GUID}" > myGUID.txt
cert-to-efi-sig-list -g "${GUID}" PK.crt PK.esl
cert-to-efi-sig-list -g "${GUID}" KEK.crt KEK.esl
cert-to-efi-sig-list -g "${GUID}" DB.crt DB.esl

rm -f noPK.esl
touch noPK.esl

sign-efi-sig-list -t "$(date --date='1 second' +'%Y-%m-%d %H:%M:%S')" \
                  -k PK.key -c PK.crt PK PK.esl PK.auth
sign-efi-sig-list -t "$(date --date='1 second' +'%Y-%m-%d %H:%M:%S')" \
                  -k PK.key -c PK.crt PK noPK.esl noPK.auth

chmod 0600 ./*.key