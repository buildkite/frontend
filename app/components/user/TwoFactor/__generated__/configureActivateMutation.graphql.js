/**
 * @flow
 * @relayHash b64e5118855b671757390fdbb8720812
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type configureActivateMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    id: string;
    token: string;
  };
|};
export type configureActivateMutationResponse = {|
  +totpActivate: ?{|
    +clientMutationId: ?string;
    +viewer: {|
      +totp: ?{|
        +id: string;
        +recoveryCodes: ?{|
          +codes: ?$ReadOnlyArray<string>;
        |};
      |};
    |};
  |};
|};
*/


/*
mutation configureActivateMutation(
  $input: TOTPActivateInput!
) {
  totpActivate(input: $input) {
    clientMutationId
    viewer {
      totp {
        id
        recoveryCodes {
          ...RecoveryCodeList_recoveryCodes
          codes
          id
        }
      }
      id
    }
  }
}

fragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {
  codes
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPActivateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "configureActivateMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TOTPActivateInput!"
          }
        ],
        "concreteType": "TOTPActivatePayload",
        "name": "totpActivate",
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
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "RecoveryCodeBatch",
                    "name": "recoveryCodes",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "FragmentSpread",
                        "name": "RecoveryCodeList_recoveryCodes",
                        "args": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "codes",
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
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "configureActivateMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPActivateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "configureActivateMutation",
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
            "type": "TOTPActivateInput!"
          }
        ],
        "concreteType": "TOTPActivatePayload",
        "name": "totpActivate",
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
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "RecoveryCodeBatch",
                    "name": "recoveryCodes",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "codes",
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
  "text": "mutation configureActivateMutation(\n  $input: TOTPActivateInput!\n) {\n  totpActivate(input: $input) {\n    clientMutationId\n    viewer {\n      totp {\n        id\n        recoveryCodes {\n          ...RecoveryCodeList_recoveryCodes\n          codes\n          id\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes\n}\n"
};

module.exports = batch;
