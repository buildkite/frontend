/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type TwoFactorDelete_viewer$ref: FragmentReference;
export type TwoFactorDelete_viewer = {|
  +totp: ?{|
    +id: string
  |},
  +$refType: TwoFactorDelete_viewer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "TwoFactorDelete_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'cdb6b050a396be1968b9d4d0fa36c7de';
module.exports = node;
