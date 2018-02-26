const LOCAL_STORAGE_CURRENT_QUERY_KEY = "GraphQLExplorer.currentQuery";

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
