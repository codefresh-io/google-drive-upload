FROM node:10.23-alpine

WORKDIR /root/google-drive-upload-plugin

RUN apk add --no-cache bash git openssh-client

COPY package.json ./

COPY yarn.lock ./

# install cf-api required binaries
RUN apk add --no-cache --virtual deps python make g++ krb5-dev && \
    yarn install --frozen-lockfile --production && \
    yarn cache clean && \
    apk del deps && \
    rm -rf /tmp/*

# copy app files
COPY . ./

# run application
CMD ["node", "/root/google-drive-upload-plugin/index.js"]
