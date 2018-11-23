/**
 * @flow
 * @relayHash cc998fdb1d46d93f9ac83a25864ab4a1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type TeamMemberRole = "MAINTAINER" | "MEMBER" | "%future added value";
export type TeamPrivacy = "SECRET" | "VISIBLE" | "%future added value";
export type TeamCreateInput = {
  clientMutationId?: ?string,
  organizationID: string,
  name: string,
  description?: ?string,
  privacy: TeamPrivacy,
  isDefaultTeam: boolean,
  defaultMemberRole: TeamMemberRole,
};
export type TeamNewMutationVariables = {|
  input: TeamCreateInput
|};
export type TeamNewMutationResponse = {|
  +teamCreate: ?{|
    +clientMutationId: ?string,
    +organization: {|
      +id: string,
      +teams: ?{|
        +count: number
      |},
    |},
    +teamEdge: {|
      +node: ?{|
        +slug: string
      |}
    |},
  |}
|};
export type TeamNewMutation = {|
  variables: TeamNewMutationVariables,
  response: TeamNewMutationResponse,
|};
*/


/*
mutation TeamNewMutation(
  $input: TeamCreateInput!
) {
  teamCreate(input: $input) {
    clientMutationId
    organization {
      id
      teams {
        count
      }
    }
    teamEdge {
      node {
        slug
        id
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "TeamCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "TeamCreateInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "clientMutationId",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "organization",
  "storageKey": null,
  "args": null,
  "concreteType": "Organization",
  "plural": false,
  "selections": [
    v3,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "teams",
      "storageKey": null,
      "args": null,
      "concreteType": "TeamConnection",
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
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "TeamNewMutation",
  "id": null,
  "text": "mutation TeamNewMutation(\n  $input: TeamCreateInput!\n) {\n  teamCreate(input: $input) {\n    clientMutationId\n    organization {\n      id\n      teams {\n        count\n      }\n    }\n    teamEdge {\n      node {\n        slug\n        id\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TeamNewMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "teamCreate",
        "storageKey": null,
        "args": v1,
        "concreteType": "TeamCreatePayload",
        "plural": false,
        "selections": [
          v2,
          v4,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "teamEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "TeamEdge",
            "plural": false,
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
                  v5
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TeamNewMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "teamCreate",
        "storageKey": null,
        "args": v1,
        "concreteType": "TeamCreatePayload",
        "plural": false,
        "selections": [
          v2,
          v4,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "teamEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "TeamEdge",
            "plural": false,
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
                  v5,
                  v3
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '714d564345a2898cb655df511dbe5d29';
module.exports = node;
