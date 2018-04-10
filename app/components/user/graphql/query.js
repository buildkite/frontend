import { parse } from 'graphql';
import { window } from 'global';

const LOCAL_STORAGE_CURRENT_QUERY_KEY = "GraphQLExplorer.currentQuery";

export function executeQuery(params) {
  return fetch(window._graphql['url'], {
    method: 'post',
    body: JSON.stringify(params),
    credentials: "same-origin",
    headers: window._graphql["headers"]
  });
}

export function interpolateQuery(query, interpolations) {
  const { organization } = interpolations;

  if (organization) {
    if (organization.slug) {
      query = query.replace("$organizationSlug", `"${organization.slug}"`);
    }

    if (organization.id) {
      query = query.replace("$organizationId", `"${organization.id}"`);
    }
  }

  return query;
}

export function findQueryOperationNames(query) {
  if (!query) {
    return undefined;
  }

  let ast;
  try {
    ast = parse(query);
  } catch (exception) {
    return;
  }

  const operations = [];
  ast.definitions.forEach((def) => {
    if (def.kind === 'OperationDefinition' && def.name) {
      operations.push(def.name.value);
    }
  });

  return operations;
}

export function getCurrentQuery() {
  return localStorage.getItem(LOCAL_STORAGE_CURRENT_QUERY_KEY);
}

export function setCurrentQuery(query) {
  if (!query) {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_QUERY_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_QUERY_KEY, query);
  }
}
