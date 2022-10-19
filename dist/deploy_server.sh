#!/bin/bash
APP_NAME=$1
SERVER=$2
DOCKER_USER=$3
DOCKER_PASS=$4
REGISTRY=$5
DOCKERFILE=$6
BRANCH_NAME=$7
TAG_NAME=$8

# echo "APP_NAME=${APP_NAME}, SERVER=${SERVER}, REGISTRY=${REGISTRY}, BRANCH_NAME=${BRANCH_NAME}  "

echo "Build Server"
if [[ $SERVER != None ]]
then
    {
        cd $SERVER
        if [[ $CURRENT_BRANCH_NAME == 'main' ]]
        then    
            CLEAN_BRANCH_NAME='main'
        elif [[ -n $TAG_NAME ]]  
        then  
            CLEAN_BRANCH_NAME=$TAG_NAME
        else
            CLEAN_BRANCH_NAME=${CURRENT_BRANCH_NAME////_}
        fi

        cd ..

        echo "Check if the app uses poetry"
        if grep -i "poetry" Dockerfile; then
            EXTRA_ARGUMENTS="--dev"
        fi

        echo "Build and Push branch image to docker"
        docker login --username=$DOCKER_USER --password=$DOCKER_PASS $REGISTRY
        docker build -f $DOCKERFILE . -t $REGISTRY/$APP_NAME:$CLEAN_BRANCH_NAME --build-arg DEVFLAG=$EXTRA_ARGUMENTS
        docker push $REGISTRY/$APP_NAME:$CLEAN_BRANCH_NAME

        echo "Docker up"
        export REGISTRY=$REGISTRY
        export CLEAN_BRANCH_NAME=$CLEAN_BRANCH_NAME
        docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml up -d

        echo "Clean up old reports" 
        rm -f unittesting.xml coverage.xml typing.xml
        
        echo "DEV image check" 
        IMG_STR=`cat docker-compose.override.yml | grep 'devenv' | cut -d ":" -f 2-3`
        DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ${IMG_STR} > /dev/null || exit 1

        echo "App health check"
        sleep 5
        docker-compose exec -T webapp python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

    echo "Code tests" 
    ## Catch the exit codes so we don't exit the whole script before we are done.
    ## Typing, linting, formatting check & unit and integration testing
    docker-compose exec -T webapp validatecodeonce; STATUS1=$?
    docker cp "$(docker-compose ps -q webapp)":/python/reports/typing.xml typing.xml
    docker cp "$(docker-compose ps -q webapp)":/python/reports/unittesting.xml unittesting.xml
    docker cp "$(docker-compose ps -q webapp)":/python/reports/coverage.xml coverage.xml
    ## Return the status code
    TOTAL=$((STATUS1))
    exit $TOTAL
fi

# echo "Docker down"
# docker-compose -f docker-compose.yml -f docker-compose.pipeline.yml down

# if [[ $BRANCH_NAME == 'main' ]]
# then
    # echo "Deploy to ${APP_NAME}-qa.satelapps.com"
    # docker login --username=$DOCKER_USER --password=$DOCKER_PASS $REGISTRY
    # export DOCKER_TLS_VERIFY='1'
    # export DOCKER_HOST='tcp://34.234.172.171:2376'
    # export DOCKER_CERT_PATH='/var/jenkins_home/.docker/machine/machines/satel-webapps-qa'
    # echo $DOCKERPASS | docker login -u $DOCKER_USER --password-stdin $REGISTRY
    # docker stack deploy --with-registry-auth -c docker-compose.qa.yml ${APP_NAME}
# fi  