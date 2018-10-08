/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type dialog_totp = {|
  +id: string;
  +recoveryCodes: ?{|
    +id: string;
    +codes: ?$ReadOnlyArray<string>;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "dialog_totp",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "id",
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "args": null,
      "concreteType": "RecoveryCodeBatch",
      "name": "recoveryCodes",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "args": null,
          "name": "id",
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "RecoveryCodeList_recoveryCodes",
          "args": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "args": null,
          "name": "codes",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TOTP"
};

module.exports = fragment;
