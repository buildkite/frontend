/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type GraphQLExplorerExamples_viewer$ref: FragmentReference;
export type GraphQLExplorerExamples_viewer = {|
  +organizations: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +name: string,
        +slug: string,
        +permissions: ?{|
          +pipelineView: ?{|
            +allowed: boolean,
            +code: ?string,
          |}
        |},
      |}
    |}>
  |},
  +$refType: GraphQLExplorerExamples_viewer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "GraphQLExplorerExamples_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "organizations",
      "storageKey": "organizations(first:100)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100,
          "type": "Int"
        }
      ],
      "concreteType": "OrganizationConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "OrganizationEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Organization",
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
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "permissions",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "OrganizationPermissions",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "pipelineView",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Permission",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "allowed",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "code",
                          "args": null,
                          "storageKey": null
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
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '092ae1e3f77e4b090e70a3312efdf78c';
module.exports = node;
