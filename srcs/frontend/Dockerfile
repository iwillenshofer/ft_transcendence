FROM node:16.14.0-bullseye

RUN apt-get update && apt-get install -y bash vim git procps tree

RUN npm i -g @angular/cli
# npm cache clear --force \

WORKDIR /frontend

USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node

ENTRYPOINT ["/entrypoint.sh"]