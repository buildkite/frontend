// @flow

export default function makeFetch(operation, variables, cacheConfig, uploadables) {
  console.log('****************************************')
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
      variables
    })
  }).then(response => response.json());
}