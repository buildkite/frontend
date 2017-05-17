FROM node:6

EXPOSE 4890
WORKDIR /frontend

ADD package.json yarn.lock /frontend/
RUN yarn install

ADD . /frontend/
CMD ["npm", "start"]
