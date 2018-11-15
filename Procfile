# PORT=5700
webpack: NODE_ENV=development ./node_modules/.bin/webpack-dev-server --config webpack/config.js --colors --cache --inline --hot --host "buildkite.localhost" --port "$PORT"

# PORT=5800 (unused)
relay: script/watch_graph

# PORT=5900
storybook: yarn storybook --quiet
