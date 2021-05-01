FROM node:12.18-alpine

RUN apk add --update git python make

WORKDIR /usr/src/app
COPY package.json .
RUN npm i --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "npm", "start" ]
