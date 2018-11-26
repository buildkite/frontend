/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type Bar_build$ref = any;
export type BuildStates = "BLOCKED" | "CANCELED" | "CANCELING" | "FAILED" | "NOT_RUN" | "PASSED" | "RUNNING" | "SCHEDULED" | "SKIPPED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Graph_pipeline$ref: FragmentReference;
export type Graph_pipeline = {|
  +builds?: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +state: BuildStates,
        +url: string,
        +startedAt: ?any,
        +finishedAt: ?any,
        +canceledAt: ?any,
        +scheduledAt: ?any,
        +$fragmentRefs: Bar_build$ref,
      |}
    |}>
  |},
  +$refType: Graph_pipeline$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Graph_pipeline",
  "type": "Pipeline",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "includeGraphData",
      "type": "Boolean!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "Condition",
      "passingValue": true,
      "condition": "includeGraphData",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "builds",
          "storageKey": "builds(branch:\"%default\",first:30,state:[\"SCHEDULED\",\"RUNNING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"CANCELING\",\"BLOCKED\"])",
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
              "value": 30,
              "type": "Int"
            },
            {
              "kind": "Literal",
              "name": "state",
              "value": [
                "SCHEDULED",
                "RUNNING",
                "PASSED",
                "FAILED",
                "CANCELED",
                "CANCELING",
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
                      "name": "id",
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
                      "name": "url",
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
                      "kind": "FragmentSpread",
                      "name": "Bar_build",
                      "args": null
                    }
                  ]
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
(node/*: any*/).hash = '7a43ac422d24f4c26eb4e8532f136d8f';
module.exports = node;
