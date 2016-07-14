FROM node:5

WORKDIR /frontend

ADD npm-shrinkwrap.json /frontend/
RUN npm install
