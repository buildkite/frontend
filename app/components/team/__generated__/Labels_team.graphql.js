/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type TeamPrivacy = "SECRET" | "VISIBLE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Labels_team$ref: FragmentReference;
export type Labels_team = {|
  +privacy: TeamPrivacy,
  +$refType: Labels_team$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Labels_team",
  "type": "Team",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "privacy",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'db8b92afd8e943337472913f9cbbb241';
module.exports = node;
