/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type RecoveryCodeList_recoveryCodes$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TwoFactorConfigureRecoveryCodes_recoveryCodes$ref: FragmentReference;
export type TwoFactorConfigureRecoveryCodes_recoveryCodes = {|
  +codes: $ReadOnlyArray<{|
    +code: string,
    +consumed: boolean,
  |}>,
  +$fragmentRefs: RecoveryCodeList_recoveryCodes$ref,
  +$refType: TwoFactorConfigureRecoveryCodes_recoveryCodes$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "TwoFactorConfigureRecoveryCodes_recoveryCodes",
  "type": "RecoveryCodeBatch",
  "metadata": null,
  "argumentDefinitions": [],
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
};
// prettier-ignore
(node/*: any*/).hash = '027bc22cb8556318655444315544c0e5';
module.exports = node;
