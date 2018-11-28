// @flow

import RelayRuntime from 'relay-runtime';

let REQUEST_PAYLOADS = {};

function compatUnpackQuery(query) {
  return (query.modern ? query.modern() : query);
}

function getRequestPayload(requestId: string) {
  // TODO: throw here if `requestId` is not in `REQUEST_PAYLOADS`
  return REQUEST_PAYLOADS[requestId];
}

export default class RelayModernPreloader {
  static registerRequest(id: string, payload: Object, _variables: Object) {
    REQUEST_PAYLOADS = { ...REQUEST_PAYLOADS, [id]: payload };
  }

  static preload(query, variables: Object, environment) {
    const modernQuery = compatUnpackQuery(query);
    const requestPayload = getRequestPayload(modernQuery.name);
    if (requestPayload) {
      const operationSelector = RelayRuntime.createOperationSelector(modernQuery, variables);
      environment.commitPayload(operationSelector, requestPayload);
    }
  }
}
