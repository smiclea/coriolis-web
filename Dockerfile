FROM node:9.2.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /usr/src/app
COPY . .

RUN yarn install
RUN yarn build

ENV CORIOLIS_URL http://127.0.0.1/

ENTRYPOINT [ "node", "server.js" ]

EXPOSE 3001