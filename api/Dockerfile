FROM node:11.9.0-alpine

ENV PORT=3030
ENV NODE_APP_DIR=/home/node/app
ARG SET_DEVELOPMENT_NODE_ENV
ENV NODE_ENV=${SET_DEVELOPMENT_NODE_ENV:+development}
ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR $NODE_APP_DIR

RUN apk add --no-cache \
      curl \
      ffmpeg \
      python \
    && curl -L https://yt-dl.org/downloads/2019.02.08/youtube-dl -o /usr/local/bin/youtube-dl \
    && chmod a+rx /usr/local/bin/youtube-dl \
    && npm install -g npm@6.8.0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD npm start
