import { window } from 'global';
import { introspectionQuery, buildClientSchema } from 'graphql';

let cachedSchema = null;

export function getGraphQLSchema() {
  if (cachedSchema) {
    return cachedSchema;
  } else {
    throw new Error("Schema needs to be fetched first");
  }
}

export function setGraphQLSchemaFromJSON(json) {
  cachedSchema = buildClientSchema(json);
}

export function fetchAndBuildGraphQLSchema() {
  return new Promise(function(resolve, reject) {
    // If we've already loaded the schema, let's resolve right away.
    if (cachedSchema) {
      resolve(cachedSchema);
    }

    // Fetch the schema using the introspection query provided by GraphQL
    executeGraphQLQuery({ query: introspectionQuery }).then((result) => {
      // Now convert it to JSON
      result.json().then((json) => {
        if (json && json.data) {
          cachedSchema = buildClientSchema(json.data);
          resolve(cachedSchema);
        } else {
          reject("Failed to find `data` payload in GraphQL response");
        }
      }).catch((error) => {
        reject("Failed to parse JSON response");
      });
    }).catch(function(error) {
      reject("Request for GraphQL schema failed");
    });
  });
}

export function executeGraphQLQuery(params) {
  return fetch(window._graphql['url'], {
    method: 'post',
    body: JSON.stringify(params),
    credentials: "same-origin",
    headers: window._graphql["headers"],
  })
}
