/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AgentsCount_organization$ref: FragmentReference;
export type AgentsCount_organization = {|
  +agents: ?{|
    +count: number
  |},
  +$refType: AgentsCount_organization$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AgentsCount_organization",
  "type": "Organization",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "agents",
      "storageKey": null,
      "args": null,
      "concreteType": "AgentConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "count",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '793a17dd1d7dc84bf48c07d7e337688c';
module.exports = node;
