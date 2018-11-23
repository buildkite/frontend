/**
 * @flow
 * @relayHash f218746da98b918c49e0176a5f661c5e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type TwoFactorConfigureRecoveryCodes_recoveryCodes$ref = any;
export type TwoFactorConfigureRefetchNewTotpConfigQueryVariables = {|
  id: string
|};
export type TwoFactorConfigureRefetchNewTotpConfigQueryResponse = {|
  +viewer: ?{|
    +totp: ?{|
      +id: string,
      +recoveryCodes: {|
        +$fragmentRefs: TwoFactorConfigureRecoveryCodes_recoveryCodes$ref
      |},
    |}
  |}
|};
export type TwoFactorConfigureRefetchNewTotpConfigQuery = {|
  variables: TwoFactorConfigureRefetchNewTotpConfigQueryVariables,
  response: TwoFactorConfigureRefetchNewTotpConfigQueryResponse,
|};
*/


/*
query TwoFactorConfigureRefetchNewTotpConfigQuery(
  $id: ID!
) {
  viewer {
    totp(id: $id) {
      id
      recoveryCodes {
        ...TwoFactorConfigureRecoveryCodes_recoveryCodes
        id
      }
    }
    id
  }
}

fragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {
  ...RecoveryCodeList_recoveryCodes
  codes {
    code
    consumed
  }
}

fragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {
  codes {
    code
    consumed
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "ID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "TwoFactorConfigureRefetchNewTotpConfigQuery",
  "id": null,
  "text": "query TwoFactorConfigureRefetchNewTotpConfigQuery(\n  $id: ID!\n) {\n  viewer {\n    totp(id: $id) {\n      id\n      recoveryCodes {\n        ...TwoFactorConfigureRecoveryCodes_recoveryCodes\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {\n  ...RecoveryCodeList_recoveryCodes\n  codes {\n    code\n    consumed\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes {\n    code\n    consumed\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TwoFactorConfigureRefetchNewTotpConfigQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "totp",
            "storageKey": null,
            "args": v1,
            "concreteType": "TOTP",
            "plural": false,
            "selections": [
              v2,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "recoveryCodes",
                "storageKey": null,
                "args": null,
                "concreteType": "RecoveryCodeBatch",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "TwoFactorConfigureRecoveryCodes_recoveryCodes",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TwoFactorConfigureRefetchNewTotpConfigQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "totp",
            "storageKey": null,
            "args": v1,
            "concreteType": "TOTP",
            "plural": false,
            "selections": [
              v2,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "recoveryCodes",
                "storageKey": null,
                "args": null,
                "concreteType": "RecoveryCodeBatch",
                "plural": false,
                "selections": [
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
                  },
                  v2
                ]
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aca3494b8d90728e560a5235cab1b7db';
module.exports = node;
