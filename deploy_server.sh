#!/bin/bash
APP_NAME=$1
REGISTRY=$2
CLEAN_BRANCH_NAME=$3

export REGISTRY=$REGISTRY
export CLEAN_BRANCH_NAME=$CLEAN_BRANCH_NAME 

echo "DEV image check" 
IMG_STR=`cat docker-compose.override.yml | grep 'devenv'| cut -d ":" -f 2-3`
IMG_LIST=( $IMG_STR ) #convert string into an array
for IMG in "${IMG_LIST[@]}"
do  
    DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ${IMG} > /dev/null || exit 1
done

echo "Docker up"
docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml up -d