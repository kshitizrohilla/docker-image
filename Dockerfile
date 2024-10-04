FROM node:20-alpine

RUN apk update
RUN apk add python3
RUN apk add make
RUN apk add build-base
RUN apk add bash

COPY CONTAINER_SERVER ./CONTAINER_SERVER
COPY app ./app

WORKDIR /app
RUN npm i
RUN npm -g i concurrently nodemon

WORKDIR /CONTAINER_SERVER
RUN npm i

WORKDIR /app

EXPOSE 5001 5002

# CMD ["sh", "-c", "nodemon app.js & node CONTAINER_SERVER.js"]
CMD ["npm", "run", "dev"]