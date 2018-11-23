/**
 * @flow
 * @relayHash 0238bf8dcd7c811b9efa804506763011
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type TwoFactor_viewer$ref = any;
export type TOTPActivateInput = {
  clientMutationId?: ?string,
  id: string,
  token: string,
};
export type TwoFactorConfigureActivateMutationVariables = {|
  input: TOTPActivateInput
|};
export type TwoFactorConfigureActivateMutationResponse = {|
  +totpActivate: ?{|
    +viewer: {|
      +$fragmentRefs: TwoFactor_viewer$ref
    |}
  |}
|};
export type TwoFactorConfigureActivateMutation = {|
  variables: TwoFactorConfigureActivateMutationVariables,
  response: TwoFactorConfigureActivateMutationResponse,
|};
*/


/*
mutation TwoFactorConfigureActivateMutation(
  $input: TOTPActivateInput!
) {
  totpActivate(input: $input) {
    viewer {
      ...TwoFactor_viewer
      id
    }
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "TOTPActivateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "TOTPActivateInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "code",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "TwoFactorConfigureActivateMutation",
  "id": null,
  "text": "mutation TwoFactorConfigureActivateMutation(\n  $input: TOTPActivateInput!\n) {\n  totpActivate(input: $input) {\n    viewer {\n      ...TwoFactor_viewer\n      id\n    }\n  }\n}\n\nfragment TwoFactor_viewer on Viewer {\n  ...SettingsMenu_viewer\n  ...TwoFactorConfigure_viewer\n  ...TwoFactorDelete_viewer\n  user {\n    hasPassword\n    id\n  }\n  totp {\n    ...RecoveryCodes_totp\n    id\n    recoveryCodes {\n      ...RecoveryCodeList_recoveryCodes\n      codes {\n        code\n        consumed\n      }\n      id\n    }\n  }\n}\n\nfragment SettingsMenu_viewer on Viewer {\n  organizations(first: 10) {\n    edges {\n      node {\n        name\n        slug\n        permissions {\n          pipelineView {\n            allowed\n            code\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment TwoFactorConfigure_viewer on Viewer {\n  id\n  totp {\n    id\n    recoveryCodes {\n      ...TwoFactorConfigureRecoveryCodes_recoveryCodes\n      id\n    }\n  }\n}\n\nfragment TwoFactorDelete_viewer on Viewer {\n  totp {\n    id\n  }\n}\n\nfragment RecoveryCodes_totp on TOTP {\n  id\n  recoveryCodes {\n    id\n    ...RecoveryCodeList_recoveryCodes\n    codes {\n      code\n      consumed\n    }\n  }\n}\n\nfragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {\n  codes {\n    code\n    consumed\n  }\n}\n\nfragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {\n  ...RecoveryCodeList_recoveryCodes\n  codes {\n    code\n    consumed\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "TwoFactorConfigureActivateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totpActivate",
        "storageKey": null,
        "args": v1,
        "concreteType": "TOTPActivatePayload",
        "plural": false,
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
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TwoFactorConfigureActivateMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "totpActivate",
        "storageKey": null,
        "args": v1,
        "concreteType": "TOTPActivatePayload",
        "plural": false,
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
                                  v2
                                ]
                              }
                            ]
                          },
                          v3
                        ]
                      }
                    ]
                  }
                ]
              },
              v3,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "totp",
                "storageKey": null,
                "args": null,
                "concreteType": "TOTP",
                "plural": false,
                "selections": [
                  v3,
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
                          v2,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "consumed",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      v3
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
                  v3
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
(node/*: any*/).hash = '4760f5be1fd319ef95967a165b0ec477';
module.exports = node;
