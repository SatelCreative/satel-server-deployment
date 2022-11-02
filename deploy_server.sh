#!/bin/bash
APP_NAME=$1
REGISTRY=$2
CLEAN_BRANCH_NAME=$3

# Set registry and clean branch name as global variables
export REGISTRY=$REGISTRY  
export CLEAN_BRANCH_NAME=$CLEAN_BRANCH_NAME 

echo "Dev image check" 
IMG_STR=`cat docker-compose.override.yml | grep 'devenv'| cut -d ":" -f 2-3`
IMG_LIST=( $IMG_STR ) #convert string into an array
for IMG in "${IMG_LIST[@]}"
do  
    DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ${IMG} > /dev/null || exit 1  # Check to see if the dev image is on registry or not
done

echo "Docker up"
docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml up -d