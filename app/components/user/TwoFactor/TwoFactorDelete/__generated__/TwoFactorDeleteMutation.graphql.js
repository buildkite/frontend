/**
 * @flow
 * @relayHash 7aa5304b015cf431e0630fcb173e42b9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type TOTPDeleteInput = {
  clientMutationId?: ?string,
  id: string,
};
export type TwoFactorDeleteMutationVariables = {|
  input: TOTPDeleteInput
|};
export type TwoFactorDeleteMutationResponse = {|
  +totpDelete: ?{|
    +clientMutationId: ?string,
    +viewer: {|
      +totp: ?{|
        +id: string
      |}
    |},
  |}
|};
export type TwoFactorDeleteMutation = {|
  variables: TwoFactorDeleteMutationVariables,
  response: TwoFactorDeleteMutationResponse,
|};
*/


/*
mutation TwoFactorDeleteMutation(
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "TOTPDeleteInput!"
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
  "name": "totp",
  "storageKey": null,
  "args": null,
  "concreteType": "TOTP",
  "plural": false,
  "selections": [
    v3
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "TwoFactorDeleteMutation",
  "id": null,
  "text": "mutation TwoFactorDeleteMutation(\n  $input: TOTPDeleteInput!\n) {\n  totpDelete(input: $input) {\n    clientMutationId\n    viewer {\n      totp {\n        id\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TwoFactorDeleteMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totpDelete",
        "storageKey": null,
        "args": v1,
        "concreteType": "TOTPDeletePayload",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v4
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TwoFactorDeleteMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totpDelete",
        "storageKey": null,
        "args": v1,
        "concreteType": "TOTPDeletePayload",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v4,
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e3963934a5b6600be7f8c78942207c51';
module.exports = node;
