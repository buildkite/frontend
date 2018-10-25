# PORT=6000
webpack: NODE_ENV=development ./node_modules/.bin/webpack-dev-server --config webpack/config.js --progress --colors --cache --inline --hot --host "buildkite.localhost" --port "$PORT"

# PORT=6100 (unused)
relay: script/watch_graph

# PORT=6200
storybook: yarn storybook