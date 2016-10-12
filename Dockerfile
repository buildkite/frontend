FROM node:6

WORKDIR /frontend

ADD package.json yarn.lock /frontend/
RUN yarn

ADD . /frontend/
