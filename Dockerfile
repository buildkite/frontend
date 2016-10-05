FROM node:6

WORKDIR /frontend

ADD package.json npm-shrinkwrap.json /frontend/
RUN npm install

ADD . /frontend/
