/**
 * @flow
 * @relayHash c71f4b7b8131617d2dc0db67ae677b40
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type TOTPDeleteInput = {
  clientMutationId?: ?string,
  id: string,
};
export type TotpDeleteMutationMutationVariables = {|
  input: TOTPDeleteInput
|};
export type TotpDeleteMutationMutationResponse = {|
  +totpDelete: ?{|
    +clientMutationId: ?string
  |}
|};
export type TotpDeleteMutationMutation = {|
  variables: TotpDeleteMutationMutationVariables,
  response: TotpDeleteMutationMutationResponse,
|};
*/


/*
mutation TotpDeleteMutationMutation(
  $input: TOTPDeleteInput!
) {
  totpDelete(input: $input) {
    clientMutationId
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "TOTPDeleteInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "totpDelete",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "TOTPDeleteInput!"
      }
    ],
    "concreteType": "TOTPDeletePayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "clientMutationId",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "TotpDeleteMutationMutation",
  "id": null,
  "text": "mutation TotpDeleteMutationMutation(\n  $input: TOTPDeleteInput!\n) {\n  totpDelete(input: $input) {\n    clientMutationId\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TotpDeleteMutationMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "TotpDeleteMutationMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3a80bc758791f8afb9f428c62e1e2eff';
module.exports = node;
