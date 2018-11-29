// @flow

import invariant from 'invariant';
import { createOperationSelector } from 'relay-runtime';
import type { Variables, OperationSelector, GraphQLTaggedNode, Environment } from 'react-relay';

type Payload = {payload: Object, variables: Variables};

let PRELOADED_QUERY_PAYLOADS: {[string]: Payload} = {};

function compatUnpackQuery(query) {
  return (query.modern ? query.modern() : query);
}

function getPreloadPayload(requestId: string): Payload {
  invariant(
    requestId in PRELOADED_QUERY_PAYLOADS,
    `The payload ID \`%s\` does not exist in the preloaded payloads IDs. Current preloaded IDs are: %s`,
    requestId,
    JSON.stringify(Object.keys(PRELOADED_QUERY_PAYLOADS))
  );
  return PRELOADED_QUERY_PAYLOADS[requestId];
}

export default class RelayModernPreloader {
  static registerRequest(id: string, payload: Object, variables: Variables) {
    PRELOADED_QUERY_PAYLOADS = {...PRELOADED_QUERY_PAYLOADS, [id]: { payload, variables }}
  }

	static preload(query: GraphQLTaggedNode, variables: Variables, environment: Environment) {
    const modernQuery = compatUnpackQuery(query);
    const request = getPreloadPayload(modernQuery.name)
    if (request) {
      const operationSelector: OperationSelector = createOperationSelector(modernQuery, variables);
      // $FlowExpectError
      environment.commitPayload(operationSelector, request);
    }
	}
}
