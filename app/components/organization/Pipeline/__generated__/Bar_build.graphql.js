/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type BuildTooltip_build$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Bar_build$ref: FragmentReference;
export type Bar_build = {|
  +$fragmentRefs: BuildTooltip_build$ref,
  +$refType: Bar_build$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Bar_build",
  "type": "Build",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "BuildTooltip_build",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'e985fd7367e7b671d44ad4ef5b531fe6';
module.exports = node;
