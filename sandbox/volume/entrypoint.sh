#!/bin/bash
PROJECT_NAME="transcendence"
BASE_DIR="/home/node"
PROJECT_DIR="$BASE_DIR/$PROJECT_NAME"

if [ -d "$PROJECT_DIR" ]; then
    echo "$PROJECT_DIR already exists. NestJS will not be installed."
else
    echo "$PROJECT_DIR is Empty. Installing NodeJS."
    nest new $PROJECT_NAME -p npm
fi

cd $PROJECT_DIR

echo "Starting $PROJECT_NAME"
npm run start:debug