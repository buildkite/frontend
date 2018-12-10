/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type TeamLabels_team$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type MemberTeamRow_team$ref: FragmentReference;
export type MemberTeamRow_team = {|
  +id: string,
  +uuid: string,
  +name: string,
  +description: ?string,
  +$fragmentRefs: TeamLabels_team$ref,
  +$refType: MemberTeamRow_team$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "MemberTeamRow_team",
  "type": "Team",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TeamLabels_team",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "uuid",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '0c8e323106711b95c0075c0987c87f2e';
module.exports = node;
