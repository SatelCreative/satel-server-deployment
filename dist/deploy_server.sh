#!/bin/bash
APP_NAME=$1

#echo "TAG_NAME=${TAG_NAME}"

echo "Docker up"
docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml up -d

echo "DEV image check" 
IMG_STR=`cat docker-compose.override.yml | grep 'devenv'| cut -d ":" -f 2-3`
IMG_LIST=( $IMG_STR ) #convert string into an array
for IMG in "${IMG_LIST[@]}"
do  
    echo $IMG
    DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ${IMG} > /dev/null || exit 1
done

echo "App health check"
sleep 5
docker-compose exec -T webapp python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

echo "Clean up old reports" 
rm -f unittesting.xml coverage.xml typing.xml

echo "Code tests" 
## Catch the exit codes so we don't exit the whole script before we are done.
## Typing, linting, formatting check & unit and integration testing
docker-compose exec -T webapp validatecodeonce; STATUS1=$?
docker cp "$(docker-compose ps -q webapp)":/python/reports/typing.xml typing.xml
docker cp "$(docker-compose ps -q webapp)":/python/reports/unittesting.xml unittesting.xml
docker cp "$(docker-compose ps -q webapp)":/python/reports/coverage.xml coverage.xml
## Return the status code
TOTAL=$((STATUS1))

echo "Docker down"
docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml down
exit $TOTAL

# # if [[ $BRANCH_NAME == 'main' ]]
# # then
#     # echo "Deploy to ${APP_NAME}-qa.satelapps.com"
#     # docker login --username=$DOCKER_USER --password=$DOCKER_PASS $REGISTRY
#     # export DOCKER_TLS_VERIFY='1'
#     # export DOCKER_HOST='tcp://34.234.172.171:2376'
#     # export DOCKER_CERT_PATH='/var/jenkins_home/.docker/machine/machines/satel-webapps-qa'
#     # echo $DOCKERPASS | docker login -u $DOCKER_USER --password-stdin $REGISTRY
#     # docker stack deploy --with-registry-auth -c docker-compose.qa.yml ${APP_NAME}
# # fi  