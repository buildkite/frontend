FROM node:10-stretch

EXPOSE 4890

ENV EMOJI_HOST=http://buildkite.localhost/_frontend/vendor/emojis

RUN echo "--- :package: Installing system deps" \
    # Buildkite apt sources
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 32A37959C2FA5C3C99EFBC32A79206696452D198 \
    && echo "deb http://apt.buildkite.com/buildkite-agent unstable main" > /etc/apt/sources.list.d/buildkite.list \
    # Install all the things
    && apt-get update \
    && apt-get install -y buildkite-agent

WORKDIR /frontend

# Install yarn dependencies
ADD package.json yarn.lock /frontend/
RUN yarn install

# Add the soure code to the image and check it builds
ADD . /frontend/
RUN yarn build

# Serve via webpack-dev-server
CMD ["yarn", "run", "webpack-dev-server"]
