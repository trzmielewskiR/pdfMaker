FROM node:20-alpine3.17

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 3050
CMD [ "npm", "start" ]