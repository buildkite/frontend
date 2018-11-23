/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type GraphQLExplorerConsole_graphQLSnippet$ref: FragmentReference;
export type GraphQLExplorerConsole_graphQLSnippet = {|
  +query: string,
  +operationName: ?string,
  +url: string,
  +$refType: GraphQLExplorerConsole_graphQLSnippet$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "GraphQLExplorerConsole_graphQLSnippet",
  "type": "GraphQLSnippet",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "query",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "operationName",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '8ee4dce381b204eb2f0f425962748de2';
module.exports = node;
