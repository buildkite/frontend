/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type BuildStates = "BLOCKED" | "CANCELED" | "CANCELING" | "FAILED" | "NOT_RUN" | "PASSED" | "RUNNING" | "SCHEDULED" | "SKIPPED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type BuildTooltip_build$ref: FragmentReference;
export type BuildTooltip_build = {|
  +message: ?string,
  +url: string,
  +commit: string,
  +state: BuildStates,
  +startedAt: ?any,
  +finishedAt: ?any,
  +canceledAt: ?any,
  +scheduledAt: ?any,
  +createdBy: ?{|
    +name?: string,
    +avatar?: ?{|
      +url: string
    |},
    +maybeName?: ?string,
  |},
  +$refType: BuildTooltip_build$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "avatar",
  "storageKey": null,
  "args": null,
  "concreteType": "Avatar",
  "plural": false,
  "selections": [
    v0
  ]
};
return {
  "kind": "Fragment",
  "name": "BuildTooltip_build",
  "type": "Build",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "message",
      "args": null,
      "storageKey": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "commit",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "state",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startedAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "finishedAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "canceledAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "scheduledAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "createdBy",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "UnregisteredUser",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": "maybeName",
              "name": "name",
              "args": null,
              "storageKey": null
            },
            v1
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "User",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "name",
              "args": null,
              "storageKey": null
            },
            v1
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '1f7db0e78464b1848e3e7bdb6ae042e2';
module.exports = node;
