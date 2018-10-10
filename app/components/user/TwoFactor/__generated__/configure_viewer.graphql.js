/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type configure_viewer = {|
  +totp: ?{|
    +id: string;
    +recoveryCodes: ?{|
      +codes: ?$ReadOnlyArray<string>;
    |};
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "configure_viewer",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "args": null,
      "concreteType": "TOTP",
      "name": "totp",
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
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "RecoveryCodeBatch",
          "name": "recoveryCodes",
          "plural": false,
          "selections": [
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
      "storageKey": null
    }
  ],
  "type": "Viewer"
};

module.exports = fragment;
