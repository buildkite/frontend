/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type MemberTeamRow_team$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type PipelineNewTeams_organization$ref: FragmentReference;
export type PipelineNewTeams_organization = {|
  +teams: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +uuid: string,
        +permissions: ?{|
          +pipelineView: ?{|
            +allowed: boolean
          |}
        |},
        +$fragmentRefs: MemberTeamRow_team$ref,
      |}
    |}>
  |},
  +$refType: PipelineNewTeams_organization$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "PipelineNewTeams_organization",
  "type": "Organization",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "teams",
      "storageKey": "teams(first:50)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50,
          "type": "Int"
        }
      ],
      "concreteType": "TeamConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "TeamEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Team",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "MemberTeamRow_team",
                  "args": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "uuid",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "permissions",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "TeamPermissions",
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
(node/*: any*/).hash = 'ba284e7540bcc3660c14773922c6b68c';
module.exports = node;
