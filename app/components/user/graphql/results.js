import { window } from 'global';

export function setCachedResults(output, performance) {
  return window._graphQLExplorerCachedResults = {
    output: output,
    performance: performance
  }
}

export function getCachedResults(query) {
  return window._graphQLExplorerCachedResults;
}
