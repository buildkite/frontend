FROM node:5

WORKDIR /frontend

ADD package.json npm-shrinkwrap.json /frontend/
RUN echo "--- :npm: Install" \
    && npm install
