#!/bin/bash

# Wip for launch on aws ec2
AWS_CONFIG_FILE=/root/.aws/credentials

STAGE=${1:-dev}
PROJECT=epipic

# Change the suffix on the bucket to something unique!
BUCKET=$PROJECT-deployement

# make a build directory to store artifacts
rm -rf build
mkdir build

# make the deployment bucket in case it doesn't exist
aws s3 mb s3://$BUCKET

# generate next stage yaml file
aws cloudformation package                   \
    --template-file template.yaml            \
    --output-template-file build/output.yaml \
    --s3-bucket $BUCKET

# the actual deployment step
aws cloudformation deploy                     \
    --template-file build/output.yaml         \
    --stack-name $PROJECT                     \
    --capabilities CAPABILITY_IAM             \
    --parameter-overrides Environment=$STAGE
