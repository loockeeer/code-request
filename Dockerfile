FROM node:current-alpine

COPY . /usr/src/app/

WORKDIR /usr/src/app/

RUN apk update

RUN rc-update add docker boot

RUN service docker start

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
