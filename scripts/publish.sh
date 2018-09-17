#!/bin/bash

sudo su

unzip smoothflow-activity-template.zip

cd smoothflow-activity-template

npm install

# npm config set scope binaa

# TOKEN=$(curl -s \
#   -H "Accept: application/json" \
#   -H "Content-Type:application/json" \
#   -X PUT --data '{"name": "binaa", "password": "tc1dabest"}' \
#   http://registry.npmjs.org/-/user/org.couchdb.user:binaa 2>&1 | grep -Po \
#   '(?<="token": ")[^"]*')

# npm set registry "https://registry.npmjs.org/:_authToken c8f34063-d569-46ee-a13c-87f3a39c4655"

npm publish