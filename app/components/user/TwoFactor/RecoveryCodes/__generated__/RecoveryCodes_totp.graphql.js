/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type RecoveryCodeList_recoveryCodes$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type RecoveryCodes_totp$ref: FragmentReference;
export type RecoveryCodes_totp = {|
  +id: string,
  +recoveryCodes: {|
    +id: string,
    +codes: $ReadOnlyArray<{|
      +code: string,
      +consumed: boolean,
    |}>,
    +$fragmentRefs: RecoveryCodeList_recoveryCodes$ref,
  |},
  +$refType: RecoveryCodes_totp$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "RecoveryCodes_totp",
  "type": "TOTP",
  "metadata": null,
  "argumentDefinitions": [],
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
        v0,
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
};
})();
// prettier-ignore
(node/*: any*/).hash = '46ca7b7ef3e89409c15e8e85430dcb75';
module.exports = node;
