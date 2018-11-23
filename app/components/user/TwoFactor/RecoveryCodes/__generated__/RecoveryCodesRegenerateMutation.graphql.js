/**
 * @flow
 * @relayHash 818c2e457c0f8dc58129c399e1e91322
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type TOTPRecoveryCodesRegenerateInput = {
  clientMutationId?: ?string,
  totpId: string,
};
export type RecoveryCodesRegenerateMutationVariables = {|
  input: TOTPRecoveryCodesRegenerateInput
|};
export type RecoveryCodesRegenerateMutationResponse = {|
  +totpRecoveryCodesRegenerate: ?{|
    +totp: {|
      +id: string,
      +recoveryCodes: {|
        +id: string,
        +codes: $ReadOnlyArray<{|
          +code: string,
          +consumed: boolean,
        |}>,
      |},
    |}
  |}
|};
export type RecoveryCodesRegenerateMutation = {|
  variables: RecoveryCodesRegenerateMutationVariables,
  response: RecoveryCodesRegenerateMutationResponse,
|};
*/


/*
mutation RecoveryCodesRegenerateMutation(
  $input: TOTPRecoveryCodesRegenerateInput!
) {
  totpRecoveryCodesRegenerate(input: $input) {
    totp {
      id
      recoveryCodes {
        id
        codes {
          code
          consumed
        }
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
    "type": "TOTPRecoveryCodesRegenerateInput!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "totpRecoveryCodesRegenerate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "TOTPRecoveryCodesRegenerateInput!"
      }
    ],
    "concreteType": "TOTPRecoveryCodesRegeneratePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totp",
        "storageKey": null,
        "args": null,
        "concreteType": "TOTP",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "recoveryCodes",
            "storageKey": null,
            "args": null,
            "concreteType": "RecoveryCodeBatch",
            "plural": false,
            "selections": [
              v1,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "codes",
                "storageKey": null,
                "args": null,
                "concreteType": "RecoveryCode",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "code",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "consumed",
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
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "RecoveryCodesRegenerateMutation",
  "id": null,
  "text": "mutation RecoveryCodesRegenerateMutation(\n  $input: TOTPRecoveryCodesRegenerateInput!\n) {\n  totpRecoveryCodesRegenerate(input: $input) {\n    totp {\n      id\n      recoveryCodes {\n        id\n        codes {\n          code\n          consumed\n        }\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "RecoveryCodesRegenerateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "RecoveryCodesRegenerateMutation",
    "argumentDefinitions": v0,
    "selections": v2
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9092fee398f3adae3c100f404fdfd339';
module.exports = node;
