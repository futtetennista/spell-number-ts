FROM node:18-slim

COPY . /app

WORKDIR /app

RUN yarn

ENTRYPOINT [ "yarn" "start" ]
