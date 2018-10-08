/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type RecoveryCodes_totp = {|
  +recoveryCodes: ?{|
    +codes: ?$ReadOnlyArray<string>;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecoveryCodes_totp",
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Dialog_totp",
      "args": null
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
