/**
 * @flow
 * @relayHash a44eca1417c77ed16d579b4e2924c9b8
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type deleteDeleteMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    id: string;
  };
|};
export type deleteDeleteMutationResponse = {|
  +totpDelete: ?{|
    +clientMutationId: ?string;
    +viewer: {|
      +totp: ?{|
        +id: string;
      |};
    |};
  |};
|};
*/


/*
mutation deleteDeleteMutation(
  $input: TOTPDeleteInput!
) {
  totpDelete(input: $input) {
    clientMutationId
    viewer {
      totp {
        id
      }
      id
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
        "type": "TOTPDeleteInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteDeleteMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TOTPDeleteInput!"
          }
        ],
        "concreteType": "TOTPDeletePayload",
        "name": "totpDelete",
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
            "concreteType": "Viewer",
            "name": "viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TOTP",
                "name": "totp",
                "plural": false,
                "selections": [
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
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "deleteDeleteMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPDeleteInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "deleteDeleteMutation",
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
            "type": "TOTPDeleteInput!"
          }
        ],
        "concreteType": "TOTPDeletePayload",
        "name": "totpDelete",
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
            "concreteType": "Viewer",
            "name": "viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TOTP",
                "name": "totp",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "id",
                    "storageKey": null
                  }
                ],
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
    ]
  },
  "text": "mutation deleteDeleteMutation(\n  $input: TOTPDeleteInput!\n) {\n  totpDelete(input: $input) {\n    clientMutationId\n    viewer {\n      totp {\n        id\n      }\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
