FROM node:16.14.0-bullseye

RUN apt-get update && apt-get install -y bash vim git procps tree

RUN npm i -g @nestjs/cli

USER node
WORKDIR /backend

ENTRYPOINT ["npm", "run", "start:debug"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
