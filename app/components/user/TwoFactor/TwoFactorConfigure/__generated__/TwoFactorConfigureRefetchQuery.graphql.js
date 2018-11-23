/**
 * @flow
 * @relayHash 05ad6963701144d7bfdb7a09047df44a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type TwoFactorConfigure_viewer$ref = any;
export type TwoFactorConfigureRefetchQueryVariables = {||};
export type TwoFactorConfigureRefetchQueryResponse = {|
  +viewer: ?{|
    +$fragmentRefs: TwoFactorConfigure_viewer$ref
  |}
|};
export type TwoFactorConfigureRefetchQuery = {|
  variables: TwoFactorConfigureRefetchQueryVariables,
  response: TwoFactorConfigureRefetchQueryResponse,
|};
*/


/*
query TwoFactorConfigureRefetchQuery {
  viewer {
    ...TwoFactorConfigure_viewer
    id
  }
}

fragment TwoFactorConfigure_viewer on Viewer {
  id
  totp {
    id
    recoveryCodes {
      ...TwoFactorConfigureRecoveryCodes_recoveryCodes
      id
    }
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
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "TwoFactorConfigureRefetchQuery",
  "id": null,
  "text": "query TwoFactorConfigureRefetchQuery {\n  viewer {\n    ...TwoFactorConfigure_viewer\n    id\n  }\n}\n\nfragment TwoFactorConfigure_viewer on Viewer {\n  id\n  totp {\n    id\n    recoveryCodes {\n      ...TwoFactorConfigureRecoveryCodes_recoveryCodes\n      id\n    }\n  }\n}\n\nfragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {\n  ...RecoveryCodeList_recoveryCodes\n  codes {\n    code\n    consumed\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes {\n    code\n    consumed\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TwoFactorConfigureRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "kind": "FragmentSpread",
            "name": "TwoFactorConfigure_viewer",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TwoFactorConfigureRefetchQuery",
    "argumentDefinitions": [],
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
          v0,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "totp",
            "storageKey": null,
            "args": null,
            "concreteType": "TOTP",
            "plural": false,
            "selections": [
              v0,
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
                  v0
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5207f788b563cf4490270aee9bbde8a5';
module.exports = node;
