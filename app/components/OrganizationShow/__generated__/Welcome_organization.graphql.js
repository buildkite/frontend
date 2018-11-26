/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Welcome_organization$ref: FragmentReference;
export type Welcome_organization = {|
  +slug: string,
  +permissions: ?{|
    +pipelineCreate: ?{|
      +code: ?string,
      +allowed: boolean,
      +message: ?string,
    |}
  |},
  +$refType: Welcome_organization$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Welcome_organization",
  "type": "Organization",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "permissions",
      "storageKey": null,
      "args": null,
      "concreteType": "OrganizationPermissions",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pipelineCreate",
          "storageKey": null,
          "args": null,
          "concreteType": "Permission",
          "plural": false,
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
              "name": "allowed",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "message",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '10e82fee2499c8a6dd90ea0b91591d2d';
module.exports = node;
