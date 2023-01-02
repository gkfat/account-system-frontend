#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
TODAY=$(date +"%Y%m%d")
CURRENT_COMMIT=`git rev-parse HEAD`

PROJECTPATH="/Users/gk/account-system-frontend"
REMOTE_USER="ec2-user"
REMOTE_SERVER="ec2-3-140-103-253.us-east-2.compute.amazonaws.com"
CERT_KEY="/Users/gk/certs/sideProjectEC2.pem"
REMOTE_BIN="/var/www/html/account-system-frontend"

echo "Start Deployment: $TODAY"
echo "Remote BIN Location: $REMOTE_BIN"
echo "Current Commit: $CURRENT_COMMIT"

printf "cd $PROJECTPATH && npm run build-prod\n"
if cd $PROJECTPATH && npm run build-prod ; then
    printf "${GREEN}Compile Completed${NC}\n"
else
    printf "${RED}Compile Failed${NC}\n"
    exit 1
fi

echo "Backup remote"
if ssh -i $CERT_KEY $REMOTE_USER@$REMOTE_SERVER "sudo cp -r $REMOTE_BIN $REMOTE_BIN-$TODAY" ; then
    printf "${GREEN}Backup $REMOTE_SERVER Completed${NC}\n"
else
    printf "${RED}Backup $REMOTE_SERVER Failed${NC}\n"
    exit 1
fi

echo "Uploading to $REMOTE_SERVER"
if rsync -e "ssh -i $CERT_KEY" --rsync-path "sudo rsync" -avr $PROJECTPATH/dist/* $REMOTE_USER@$REMOTE_SERVER:$REMOTE_BIN ; then
    printf "${GREEN}Upload to $REMOTE_SERVER Completed${NC}\n"
else
    printf "${RED}Upload to $REMOTE_SERVER Failed${NC}\n"
    exit 1
fi