#!/bin/bash

set -e

AREA_NAME=dev
AWS_DEFAULT_REGION=us-east-1
CDK_DEFAULT_REGION=us-east-1

sudo yum install -y jq

cd ne-one-play-cdk

npm i

cdk bootstrap -c envName=$AREA_NAME

cdk deploy --require-approval never -c envName=$AREA_NAME --trace --outputs-file ./cdk-outputs.json

# extract variables
REPOS_URI=$(../cdk-output-parser.sh NeOnePlayCdkStack$AREA_NAME appRepositoryUri cdk-outputs.json)
REPOS_NAME=$(../cdk-output-parser.sh NeOnePlayCdkStack$AREA_NAME appRepositoryName cdk-outputs.json)
REPOS=${REPOS_URI//$REPOS_NAME\//}

aws ecr get-login-password --region $AWS_DEFAULT_REGION  | docker login --username AWS --password-stdin $REPOS

## HACK: app runner has issues with dns on first pull so use placeholder image
PLACEHOLDER_TAG=placeholder
docker pull testcontainers/helloworld:latest
docker tag testcontainers/helloworld:latest $REPOS_URI:$PLACEHOLDER_TAG
docker push $REPOS_URI:$PLACEHOLDER_TAG

cd ..
docker build -t $REPOS_NAME:$AREA_NAME -f ./Dockerfile ..
cd ne-one-play-app-cdk

docker tag $REPOS_NAME:$AREA_NAME $REPOS_URI:$AREA_NAME
docker push $REPOS_URI:$AREA_NAME

npm i

cdk bootstrap -c envName=$AREA_NAME

cdk deploy --require-approval never -c envName=$AREA_NAME -c tagName=placeholder --parameters appContainerRepositoryName=$REPOS_NAME \
    --trace --outputs-file ./cdk-app-outputs.json

cdk deploy --require-approval never -c envName=$AREA_NAME --parameters appContainerRepositoryName=$REPOS_NAME \
    --trace --outputs-file ./cdk-app-outputs.json