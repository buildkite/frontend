# Buildkite Frontend

This repository contains the React/GraphQL powered parts of the [Buildkite](https://buildkite.com/) web UI.

It’s currently a work-in-progress, and unfortunately isn’t able to be run standalone from the closed-source Buildkite backend repository. You’re welcome to send a pull request with any changes if you wish, but you won’t be able to test your changes in local browser.

The main technologies used are:

- ES6
- [Webpack](https://webpack.github.io)
- [Relay](https://facebook.github.io/relay/)
- [React](http://facebook.github.io/react/)
- [GraphQL](http://graphql.org)
- [Basscss](http://www.basscss.com)

## Linting and Testing

* `yarn lint` (eslint)
* `yarn test` (jest)

## Roadmap

* Minimal viable localhsot wrapper/layout outside of the Buildkite Rails app
* Proxy GraphQL queries through graphql.buildkite.com

## License

See [LICENSE.txt](LICENSE.txt) (MIT)
