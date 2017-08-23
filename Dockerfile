FROM node:6

EXPOSE 4890

ENV FRONTEND_HOST=http://buildkite.dev:4890/_frontend/dist/ \
    EMOJI_HOST=http://buildkite.dev/_frontend/vendor/emojis

# Install watchman for relay-compiler
RUN cd /tmp \
    && curl -f -L -O "https://github.com/facebook/watchman/archive/v4.7.0.tar.gz" \
    && tar -xvf "v4.7.0.tar.gz" \
    && cd "watchman-4.7.0" \
    && ./autogen.sh \
    && ./configure --without-python --without-pcre \
    && make \
    && make install

WORKDIR /frontend

# Install yarn dependencies
ADD package.json yarn.lock /frontend/
RUN yarn install

# Build dist directory
ADD . /frontend/
RUN yarn run relay && yarn run build-production

# Default to serving the compiled static resources
CMD ["yarn", "run", "static-server"]
