/**
 * @flow
 * @relayHash 199307d75cf1651ae8857106aa6f02d1
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type configureRecoveryCodeRegenerationMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    totpId: string;
  };
|};
export type configureRecoveryCodeRegenerationMutationResponse = {|
  +totpRecoveryCodesRegenerate: ?{|
    +clientMutationId: ?string;
    +recoveryCodes: {| |};
  |};
|};
*/


/*
mutation configureRecoveryCodeRegenerationMutation(
  $input: TOTPRecoveryCodesRegenerateInput!
) {
  totpRecoveryCodesRegenerate(input: $input) {
    clientMutationId
    recoveryCodes {
      ...RecoveryCodeList_recoveryCodes
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
        "type": "TOTPRecoveryCodesRegenerateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "configureRecoveryCodeRegenerationMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TOTPRecoveryCodesRegenerateInput!"
          }
        ],
        "concreteType": "TOTPRecoveryCodesRegeneratePayload",
        "name": "totpRecoveryCodesRegenerate",
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
            "concreteType": "RecoveryCodeBatch",
            "name": "recoveryCodes",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "RecoveryCodeList_recoveryCodes",
                "args": null
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
  "name": "configureRecoveryCodeRegenerationMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPRecoveryCodesRegenerateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "configureRecoveryCodeRegenerationMutation",
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
            "type": "TOTPRecoveryCodesRegenerateInput!"
          }
        ],
        "concreteType": "TOTPRecoveryCodesRegeneratePayload",
        "name": "totpRecoveryCodesRegenerate",
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
            "concreteType": "RecoveryCodeBatch",
            "name": "recoveryCodes",
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
                "kind": "InlineFragment",
                "type": "RecoveryCodeBatch",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "codes",
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation configureRecoveryCodeRegenerationMutation(\n  $input: TOTPRecoveryCodesRegenerateInput!\n) {\n  totpRecoveryCodesRegenerate(input: $input) {\n    clientMutationId\n    recoveryCodes {\n      ...RecoveryCodeList_recoveryCodes\n      id\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes\n}\n"
};

module.exports = batch;
