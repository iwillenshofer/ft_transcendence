FROM node:buster-slim

ENV NODE_ENV build

RUN apt-get update && apt-get install -y bash vim git procps

RUN npm i -g @nestjs/cli

USER node
WORKDIR /home/node

ENTRYPOINT [ "/bin/bash", "/home/node/entrypoint.sh" ]
