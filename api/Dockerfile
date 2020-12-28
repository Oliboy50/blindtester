FROM node:12.16.3-alpine

ENV PORT=3030
ENV NODE_APP_DIR=/home/node/app
ARG SET_DEVELOPMENT_NODE_ENV
ENV NODE_ENV=${SET_DEVELOPMENT_NODE_ENV:+development}
ENV NODE_ENV=${NODE_ENV:-production}
ARG SET_NPM_UNSAFE_PERM_TRUE
ENV SET_NPM_UNSAFE_PERM_TRUE=${SET_NPM_UNSAFE_PERM_TRUE}
ENV YOUTUBE_DL_VERSION=2020.12.29

WORKDIR $NODE_APP_DIR

# Fix bug https://github.com/nodejs/docker-node/issues/813 while deploying on Heroku
RUN test -z "$SET_NPM_UNSAFE_PERM_TRUE" || (npm config set unsafe-perm true) && :

RUN apk add --no-cache \
      curl \
      ffmpeg \
      python \
    && curl -L https://yt-dl.org/downloads/${YOUTUBE_DL_VERSION}/youtube-dl -o /usr/local/bin/youtube-dl \
    && chmod a+rx /usr/local/bin/youtube-dl

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE $PORT

CMD npm start
