FROM node:12.13.1-alpine

ENV PORT=3030
ENV NODE_APP_DIR=/home/node/app
ARG SET_DEVELOPMENT_NODE_ENV
ENV NODE_ENV=${SET_DEVELOPMENT_NODE_ENV:+development}
ENV NODE_ENV=${NODE_ENV:-production}
ARG SET_NPM_UNSAFE_PERM_TRUE
ENV SET_NPM_UNSAFE_PERM_TRUE=${SET_NPM_UNSAFE_PERM_TRUE}

WORKDIR $NODE_APP_DIR

# Fix bug https://github.com/nodejs/docker-node/issues/813 while deploying on Heroku
RUN test -z "$SET_NPM_UNSAFE_PERM_TRUE" || (npm config set unsafe-perm true) && :

RUN apk add --no-cache \
      curl \
      ffmpeg \
      python \
    && curl -L https://yt-dl.org/downloads/2020.03.01/youtube-dl -o /usr/local/bin/youtube-dl \
    && chmod a+rx /usr/local/bin/youtube-dl \
    && npm install -g npm@6.13.6

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD npm start
