// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime';

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  return fetch(window._graphql.url, {
    method: 'POST',
    headers: window._graphql.headers,
    credentials: "same-origin",
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);
const handlerProvider = null;
export default new Environment({handlerProvider, network, store});
