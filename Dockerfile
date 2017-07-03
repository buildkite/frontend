FROM node:6

EXPOSE 4890

RUN echo "--- :watchman: Installing watchman" \
    && cd /tmp \
    && curl -f -L -O "https://github.com/facebook/watchman/archive/v4.7.0.tar.gz" \
    && tar -xvf "v4.7.0.tar.gz" \
    && cd "watchman-4.7.0" \
    && ./autogen.sh \
    && ./configure --without-python --without-pcre \
    && make \
    && make install

WORKDIR /frontend

ADD package.json yarn.lock /frontend/
run echo "--- :yarn: Installing dependencies through Yarn" \
    && yarn install

ADD . /frontend/

CMD ["npm", "start"]
