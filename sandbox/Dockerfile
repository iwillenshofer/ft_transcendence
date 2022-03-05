FROM node:16.14.0-bullseye

ENV NODE_ENV build

RUN apt-get update && apt-get install -y bash vim git procps tree

RUN npm i -g @nestjs/cli
RUN npm i -g @angular/cli

USER node
WORKDIR /home/node/
