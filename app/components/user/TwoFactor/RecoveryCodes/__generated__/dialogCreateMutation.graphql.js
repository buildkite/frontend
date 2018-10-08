/**
 * @flow
 * @relayHash 62e900b354c66cfde0c65e389d8012a1
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type dialogCreateMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    totpId: string;
  };
|};
export type dialogCreateMutationResponse = {|
  +totpRecoveryCodesRegenerate: ?{|
    +clientMutationId: ?string;
    +totp: {|
      +id: string;
      +recoveryCodes: ?{|
        +id: string;
        +codes: ?$ReadOnlyArray<string>;
      |};
    |};
    +recoveryCodes: {|
      +id: string;
      +codes: ?$ReadOnlyArray<string>;
    |};
  |};
|};
*/


/*
mutation dialogCreateMutation(
  $input: TOTPRecoveryCodesRegenerateInput!
) {
  totpRecoveryCodesRegenerate(input: $input) {
    clientMutationId
    totp {
      id
      recoveryCodes {
        ...RecoveryCodeList_recoveryCodes
        id
        codes
      }
    }
    recoveryCodes {
      ...RecoveryCodeList_recoveryCodes
      id
      codes
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
    "name": "dialogCreateMutation",
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
                    "name": "id",
                    "storageKey": null
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
                "name": "id",
                "storageKey": null
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
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "dialogCreateMutation",
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
    "name": "dialogCreateMutation",
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
    ]
  },
  "text": "mutation dialogCreateMutation(\n  $input: TOTPRecoveryCodesRegenerateInput!\n) {\n  totpRecoveryCodesRegenerate(input: $input) {\n    clientMutationId\n    totp {\n      id\n      recoveryCodes {\n        ...RecoveryCodeList_recoveryCodes\n        id\n        codes\n      }\n    }\n    recoveryCodes {\n      ...RecoveryCodeList_recoveryCodes\n      id\n      codes\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes\n}\n"
};

module.exports = batch;
