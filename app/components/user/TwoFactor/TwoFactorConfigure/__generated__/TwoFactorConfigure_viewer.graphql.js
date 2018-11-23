/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type TwoFactorConfigureRecoveryCodes_recoveryCodes$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TwoFactorConfigure_viewer$ref: FragmentReference;
export type TwoFactorConfigure_viewer = {|
  +id: string,
  +totp: ?{|
    +id: string,
    +recoveryCodes: {|
      +$fragmentRefs: TwoFactorConfigureRecoveryCodes_recoveryCodes$ref
    |},
  |},
  +$refType: TwoFactorConfigure_viewer$ref,
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
  "name": "TwoFactorConfigure_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
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
              "kind": "FragmentSpread",
              "name": "TwoFactorConfigureRecoveryCodes_recoveryCodes",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'be42258de8ffe29f28c66ecbf37b4a23';
module.exports = node;
