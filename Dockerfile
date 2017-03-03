FROM node:6

ENV YARN_VERSION=0.21.3

# Base deps

RUN echo "--- :package: Installing system deps" \
    && npm install -g yarn@${YARN_VERSION}

WORKDIR /frontend

ADD package.json yarn.lock /frontend/
RUN echo "--- :yarn: Installing application deps" \
    && yarn

ADD . /frontend/
