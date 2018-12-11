// @flow

import warn from 'app/lib/warn';
import { createOperationSelector } from 'relay-runtime';
import type { Variables, OperationSelector, GraphQLTaggedNode } from 'react-relay';

type Payload = {payload: Object, variables: Variables};

let PRELOADED_QUERY_PAYLOADS: {[string]: Payload} = {};

function compatUnpackQuery(query) {
  return (query.modern ? query.modern() : query);
}

function getPreloadPayload(requestId: string): Payload {
  warn(
    requestId in PRELOADED_QUERY_PAYLOADS,
    `The payload ID \`%s\` does not exist in the preloaded payloads IDs. Current preloaded IDs are: %s`,
    requestId,
    JSON.stringify(Object.keys(PRELOADED_QUERY_PAYLOADS))
  );

  return PRELOADED_QUERY_PAYLOADS[requestId];
}

function sortObject(object: Object) {
  const clone = (({}: any): typeof object);
  return Object.keys(object).sort().reduce((memo, key) => ({ ...memo, [key]: object[key] }), clone);
}

export default class RelayModernPreloader {
  static registerRequest(id: string, payload: Object, variables: Variables) {
    PRELOADED_QUERY_PAYLOADS = { ...PRELOADED_QUERY_PAYLOADS, [id]: { payload, variables } };
  }

  static preload(config: {query: GraphQLTaggedNode, variables?: Variables, environment: *}) {
    const modernRuntimeQuery = compatUnpackQuery(config.query);
    const preloadPayload = getPreloadPayload(modernRuntimeQuery.name);

    if (preloadPayload) {
      if (process.env.NODE_ENV !== 'production') {
        const diff = require('lodash.difference');
        const preloadVars = preloadPayload.variables || {};
        const runtimeVars = config.variables || {};
        const differences = [Object.keys, Object.values].reduce((memo, fn) => (memo.concat(diff(fn(preloadVars), fn(runtimeVars)))), []);

        warn(
          differences.length === 0,
          `Your preload and runtime variables do not match - this will almost certainly result in a mismatch of preloaded data for \`%s\`!\n\n` +
          `Preload variables: \n%s\n\n` +
          `Runtime variables: \n%s\n\n`,
          modernRuntimeQuery.name,
          JSON.stringify(sortObject(preloadVars), null, 4),
          JSON.stringify(sortObject(runtimeVars), null, 4)
        );
      }

      const operationSelector: OperationSelector = createOperationSelector(modernRuntimeQuery, config.variables);
      config.environment.commitPayload(operationSelector, preloadPayload.payload);
      const check = config.environment.check(operationSelector.root);

      warn(
        check,
        `The preload payload for \`%s\` did not satisfy initial render data requrirements! Check your preload query!`,
        modernRuntimeQuery.name,
      );
    }
  }
}
