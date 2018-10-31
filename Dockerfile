FROM node:10-stretch

EXPOSE 4890

ENV EMOJI_HOST=http://buildkite.localhost/_frontend/vendor/emojis

WORKDIR /frontend

# Install yarn dependencies
ADD package.json yarn.lock /frontend/
RUN yarn install

# Add the soure code to the image and check it builds
ADD . /frontend/
RUN yarn build

# Serve via webpack-dev-server
CMD ["yarn", "run", "webpack-dev-server"]
