/**
 * @flow
 * @relayHash 632573972bd05c836694b4893829f296
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type configureCreateMutationVariables = {|
  input: {
    clientMutationId?: ?string;
  };
|};
export type configureCreateMutationResponse = {|
  +totpCreate: ?{|
    +clientMutationId: ?string;
    +provisioningUri: string;
    +totp: {|
      +id: string;
      +recoveryCodes: ?{|
        +codes: ?$ReadOnlyArray<string>;
      |};
    |};
  |};
|};
*/


/*
mutation configureCreateMutation(
  $input: TOTPCreateInput!
) {
  totpCreate(input: $input) {
    clientMutationId
    provisioningUri
    totp {
      id
      recoveryCodes {
        ...RecoveryCodeList_recoveryCodes
        codes
        id
      }
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
        "type": "TOTPCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "configureCreateMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TOTPCreateInput!"
          }
        ],
        "concreteType": "TOTPCreatePayload",
        "name": "totpCreate",
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
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "provisioningUri",
            "storageKey": null
          },
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
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "configureCreateMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "configureCreateMutation",
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
            "type": "TOTPCreateInput!"
          }
        ],
        "concreteType": "TOTPCreatePayload",
        "name": "totpCreate",
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
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "provisioningUri",
            "storageKey": null
          },
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation configureCreateMutation(\n  $input: TOTPCreateInput!\n) {\n  totpCreate(input: $input) {\n    clientMutationId\n    provisioningUri\n    totp {\n      id\n      recoveryCodes {\n        ...RecoveryCodeList_recoveryCodes\n        codes\n        id\n      }\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes\n}\n"
};

module.exports = batch;
