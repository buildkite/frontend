// Results are just cached in memory so they reset when the page reloads
let LOCAL_RESULTS_CACHE = null;

export function setResultsCache(output, performance) {
  return LOCAL_RESULTS_CACHE = {
    output: output,
    performance: performance
  };
}

export function getResultsCache() {
  return LOCAL_RESULTS_CACHE;
}

// Queries are stored in local storage so they persist between page reloads
const LOCAL_STORAGE_CURRENT_QUERY_KEY = "GraphQLExplorer.currentQuery"

export function getQueryCache() {
  return localStorage.getItem(LOCAL_STORAGE_CURRENT_QUERY_KEY);
}

export function setQueryCache(query) {
  if (!query) {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_QUERY_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_QUERY_KEY, query);
  }

  return query;
}
