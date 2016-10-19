FROM node:6

# Base deps

RUN echo "--- :package: Installing system deps" \
    && npm install -g yarn

WORKDIR /frontend

ADD package.json yarn.lock /frontend/
RUN echo "--- :yarn: Install" \
    && yarn

ADD . /frontend/
