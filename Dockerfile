FROM node:5

WORKDIR /frontend

ADD package.json npm-shrinkwrap.json /frontend/
RUN npm install

ADD . /frontend/
