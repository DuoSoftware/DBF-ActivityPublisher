#!/bin/bash

sudo su

unzip $(find ./ -iname \*.zip)

cd $(ls -d */)

npm install

npm publish