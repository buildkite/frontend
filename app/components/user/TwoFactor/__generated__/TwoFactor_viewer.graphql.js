/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type RecoveryCodeList_recoveryCodes$ref = any;
type RecoveryCodes_totp$ref = any;
type SettingsMenu_viewer$ref = any;
type TwoFactorConfigure_viewer$ref = any;
type TwoFactorDelete_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TwoFactor_viewer$ref: FragmentReference;
export type TwoFactor_viewer = {|
  +user: ?{|
    +hasPassword: boolean
  |},
  +totp: ?{|
    +id: string,
    +recoveryCodes: {|
      +codes: $ReadOnlyArray<{|
        +code: string,
        +consumed: boolean,
      |}>,
      +$fragmentRefs: RecoveryCodeList_recoveryCodes$ref,
    |},
    +$fragmentRefs: RecoveryCodes_totp$ref,
  |},
  +$fragmentRefs: SettingsMenu_viewer$ref & TwoFactorConfigure_viewer$ref & TwoFactorDelete_viewer$ref,
  +$refType: TwoFactor_viewer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "TwoFactor_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SettingsMenu_viewer",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TwoFactorConfigure_viewer",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TwoFactorDelete_viewer",
      "args": null
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
        }
      ]
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
          "kind": "FragmentSpread",
          "name": "RecoveryCodes_totp",
          "args": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
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
              "name": "RecoveryCodeList_recoveryCodes",
              "args": null
            },
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
};
// prettier-ignore
(node/*: any*/).hash = '80f15c970b7c961563ce76037ad0a48c';
module.exports = node;
