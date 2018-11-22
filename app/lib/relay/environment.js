// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime';

if (process.env.NODE_ENV === 'development') {
  require('relay-devtools').installRelayDevTools();
}

function wrapFetch(wrapped) {
  if (process.env.NODE_ENV === 'development') {
    const {createRelayNetworkLogger, RelayNetworkLoggerTransaction} = require('relay-runtime');
    const logger = createRelayNetworkLogger(RelayNetworkLoggerTransaction);
    return logger.wrapFetch(wrapped);
  }
  return wrapped;
}

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  return fetch(window._graphql.url, {
    method: 'POST',
    headers: {
      ...window._graphql.headers,
    	'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json());
}

let relayEnvironment = null

export function createEnvironment() {
  if (relayEnvironment === null) {
    const network = Network.create(wrapFetch(fetchQuery));
    const source = new RecordSource({});
    const store = new Store(source);
    const handlerProvider = null;
    relayEnvironment = new Environment({handlerProvider, network, store});
  }
  return relayEnvironment;
}

export default relayEnvironment;
