import { parse } from 'graphql';
import { window } from 'global';

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
  } catch (e) {
    return;
  }

  const operations = [];
  ast.definitions.forEach(def => {
    if (def.kind === 'OperationDefinition' && def.name) {
      operations.push(def.name.value);
    }
  });

  return operations;
}
