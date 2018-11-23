/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type RecoveryCodeList_recoveryCodes$ref: FragmentReference;
export type RecoveryCodeList_recoveryCodes = {|
  +codes: $ReadOnlyArray<{|
    +code: string,
    +consumed: boolean,
  |}>,
  +$refType: RecoveryCodeList_recoveryCodes$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "RecoveryCodeList_recoveryCodes",
  "type": "RecoveryCodeBatch",
  "metadata": null,
  "argumentDefinitions": [],
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
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '98a7688591ffb00960f4b4acc49ca216';
module.exports = node;
