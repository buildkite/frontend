/**
 * @flow
 * @relayHash e6fe0efd571494d1bfe6130afc479c5d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type TOTPCreateInput = {
  clientMutationId?: ?string
};
export type TotpCreateMutationVariables = {|
  input: TOTPCreateInput
|};
export type TotpCreateMutationResponse = {|
  +totpCreate: ?{|
    +provisioningUri: string,
    +totp: {|
      +id: string
    |},
  |}
|};
export type TotpCreateMutation = {|
  variables: TotpCreateMutationVariables,
  response: TotpCreateMutationResponse,
|};
*/


/*
mutation TotpCreateMutation(
  $input: TOTPCreateInput!
) {
  totpCreate(input: $input) {
    provisioningUri
    totp {
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "TOTPCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "totpCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "TOTPCreateInput!"
      }
    ],
    "concreteType": "TOTPCreatePayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "provisioningUri",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totp",
        "storageKey": null,
        "args": null,
        "concreteType": "TOTP",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "TotpCreateMutation",
  "id": null,
  "text": "mutation TotpCreateMutation(\n  $input: TOTPCreateInput!\n) {\n  totpCreate(input: $input) {\n    provisioningUri\n    totp {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TotpCreateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "TotpCreateMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '4b2520e771570fabaeec73acd40ae79d';
module.exports = node;
