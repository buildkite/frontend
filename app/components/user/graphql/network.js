import { window } from 'global';

export function executeGraphQLQuery(params) {
  return fetch(window._graphql['url'], {
    method: 'post',
    body: JSON.stringify(params),
    credentials: "same-origin",
    headers: window._graphql["headers"]
  });
}
