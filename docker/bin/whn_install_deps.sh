#!/bin/bash

SRC_PATH=$1
cd $1
npm install . --silent
cd themes/blackburn
npm install . --silent
