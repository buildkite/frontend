/**
 * @flow
 * @relayHash 945702f7bbe6c650100245fa9ffbdd99
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type TeamNewMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    organizationID: string;
    name: string;
    description?: ?string;
    privacy: "VISIBLE" | "SECRET";
    isDefaultTeam: boolean;
    defaultMemberRole: "MEMBER" | "MAINTAINER";
  };
|};
export type TeamNewMutationResponse = {|
  +teamCreate: ?{|
    +clientMutationId: ?string;
    +organization: {|
      +id: string;
      +teams: ?{|
        +count: number;
      |};
    |};
    +teamEdge: {|
      +node: ?{|
        +slug: string;
      |};
    |};
  |};
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

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TeamCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TeamNewMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TeamCreateInput!"
          }
        ],
        "concreteType": "TeamCreatePayload",
        "name": "teamCreate",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "clientMutationId",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "name": "organization",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TeamConnection",
                "name": "teams",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "count",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "TeamEdge",
            "name": "teamEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Team",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "slug",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "TeamNewMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TeamCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "TeamNewMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TeamCreateInput!"
          }
        ],
        "concreteType": "TeamCreatePayload",
        "name": "teamCreate",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "clientMutationId",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "name": "organization",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TeamConnection",
                "name": "teams",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "count",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "TeamEdge",
            "name": "teamEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Team",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "slug",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation TeamNewMutation(\n  $input: TeamCreateInput!\n) {\n  teamCreate(input: $input) {\n    clientMutationId\n    organization {\n      id\n      teams {\n        count\n      }\n    }\n    teamEdge {\n      node {\n        slug\n        id\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
