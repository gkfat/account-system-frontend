#!/bin/bash

npm run build-prod
sudo scp -r dist /var/www/html