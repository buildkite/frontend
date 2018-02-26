let cachedResults = null;

export function setCachedResults(output, performance) {
  return cachedResults = {
    output: output,
    performance: performance
  }
}

export function getCachedResults(query) {
  return cachedResults;
}
