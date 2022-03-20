FROM node:16.14.0-bullseye

RUN apt-get update && apt-get install -y bash vim git procps tree

RUN npm i -g @angular/cli

USER node
WORKDIR /frontend

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.json"]
