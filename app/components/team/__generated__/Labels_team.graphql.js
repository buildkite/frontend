/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type Labels_team = {|
  +privacy: "VISIBLE" | "SECRET";
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Labels_team",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "privacy",
      "storageKey": null
    }
  ],
  "type": "Team"
};

module.exports = fragment;
