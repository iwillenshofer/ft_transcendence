FROM node:16.14.0-bullseye

RUN apt-get update && apt-get install -y bash vim git procps tree

RUN npm i -g @nestjs/cli

WORKDIR /backend

USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
ENTRYPOINT ["/entrypoint.sh"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
