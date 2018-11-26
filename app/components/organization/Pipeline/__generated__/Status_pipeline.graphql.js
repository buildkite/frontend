/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type BuildTooltip_build$ref = any;
export type BuildStates = "BLOCKED" | "CANCELED" | "CANCELING" | "FAILED" | "NOT_RUN" | "PASSED" | "RUNNING" | "SCHEDULED" | "SKIPPED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Status_pipeline$ref: FragmentReference;
export type Status_pipeline = {|
  +id: string,
  +builds: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +state: BuildStates,
        +url: string,
        +$fragmentRefs: BuildTooltip_build$ref,
      |}
    |}>
  |},
  +$refType: Status_pipeline$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Status_pipeline",
  "type": "Pipeline",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "builds",
      "storageKey": "builds(branch:\"%default\",first:1,state:[\"RUNNING\",\"CANCELING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"BLOCKED\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "branch",
          "value": "%default",
          "type": "[String!]"
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 1,
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "state",
          "value": [
            "RUNNING",
            "CANCELING",
            "PASSED",
            "FAILED",
            "CANCELED",
            "BLOCKED"
          ],
          "type": "[BuildStates!]"
        }
      ],
      "concreteType": "BuildConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "BuildEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Build",
              "plural": false,
              "selections": [
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
                  "name": "url",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "BuildTooltip_build",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'e05b6c25c52198abdf25b0f339188e44';
module.exports = node;
