// @flow

export const MockFetch = jest.fn();

export default function MockMakeFetch(operation, variables, cacheConfig, uploadables) {
  return MockFetch(operation, variables, cacheConfig, uploadables);
}