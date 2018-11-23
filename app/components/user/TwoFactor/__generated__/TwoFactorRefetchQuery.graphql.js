/**
 * @flow
 * @relayHash 33131970c8115125443174ad004e6513
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type TwoFactor_viewer$ref = any;
export type TwoFactorRefetchQueryVariables = {||};
export type TwoFactorRefetchQueryResponse = {|
  +viewer: ?{|
    +$fragmentRefs: TwoFactor_viewer$ref
  |}
|};
export type TwoFactorRefetchQuery = {|
  variables: TwoFactorRefetchQueryVariables,
  response: TwoFactorRefetchQueryResponse,
|};
*/


/*
query TwoFactorRefetchQuery {
  viewer {
    ...TwoFactor_viewer
    id
  }
}

fragment TwoFactor_viewer on Viewer {
  ...SettingsMenu_viewer
  ...TwoFactorConfigure_viewer
  ...TwoFactorDelete_viewer
  user {
    hasPassword
    id
  }
  totp {
    ...RecoveryCodes_totp
    id
    recoveryCodes {
      ...RecoveryCodeList_recoveryCodes
      codes {
        code
        consumed
      }
      id
    }
  }
}

fragment SettingsMenu_viewer on Viewer {
  organizations(first: 10) {
    edges {
      node {
        name
        slug
        permissions {
          pipelineView {
            allowed
            code
          }
        }
        id
      }
    }
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

fragment TwoFactorDelete_viewer on Viewer {
  totp {
    id
  }
}

fragment RecoveryCodes_totp on TOTP {
  id
  recoveryCodes {
    id
    ...RecoveryCodeList_recoveryCodes
    codes {
      code
      consumed
    }
  }
}

fragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {
  codes {
    code
    consumed
  }
}

fragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {
  ...RecoveryCodeList_recoveryCodes
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
  "name": "code",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "TwoFactorRefetchQuery",
  "id": null,
  "text": "query TwoFactorRefetchQuery {\n  viewer {\n    ...TwoFactor_viewer\n    id\n  }\n}\n\nfragment TwoFactor_viewer on Viewer {\n  ...SettingsMenu_viewer\n  ...TwoFactorConfigure_viewer\n  ...TwoFactorDelete_viewer\n  user {\n    hasPassword\n    id\n  }\n  totp {\n    ...RecoveryCodes_totp\n    id\n    recoveryCodes {\n      ...RecoveryCodeList_recoveryCodes\n      codes {\n        code\n        consumed\n      }\n      id\n    }\n  }\n}\n\nfragment SettingsMenu_viewer on Viewer {\n  organizations(first: 10) {\n    edges {\n      node {\n        name\n        slug\n        permissions {\n          pipelineView {\n            allowed\n            code\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment TwoFactorConfigure_viewer on Viewer {\n  id\n  totp {\n    id\n    recoveryCodes {\n      ...TwoFactorConfigureRecoveryCodes_recoveryCodes\n      id\n    }\n  }\n}\n\nfragment TwoFactorDelete_viewer on Viewer {\n  totp {\n    id\n  }\n}\n\nfragment RecoveryCodes_totp on TOTP {\n  id\n  recoveryCodes {\n    id\n    ...RecoveryCodeList_recoveryCodes\n    codes {\n      code\n      consumed\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes {\n    code\n    consumed\n  }\n}\n\nfragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {\n  ...RecoveryCodeList_recoveryCodes\n  codes {\n    code\n    consumed\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TwoFactorRefetchQuery",
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
            "name": "TwoFactor_viewer",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TwoFactorRefetchQuery",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "organizations",
            "storageKey": "organizations(first:10)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "concreteType": "OrganizationConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "OrganizationEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Organization",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "slug",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "permissions",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "OrganizationPermissions",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "pipelineView",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Permission",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "allowed",
                                "args": null,
                                "storageKey": null
                              },
                              v0
                            ]
                          }
                        ]
                      },
                      v1
                    ]
                  }
                ]
              }
            ]
          },
          v1,
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
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "codes",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "RecoveryCode",
                    "plural": true,
                    "selections": [
                      v0,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "consumed",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  v1
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "hasPassword",
                "args": null,
                "storageKey": null
              },
              v1
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '44016d0c19105d867c345e852a7ac149';
module.exports = node;
