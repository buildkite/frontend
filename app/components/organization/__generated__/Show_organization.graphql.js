/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type Pipelines_organization$ref = any;
type Teams_organization$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Show_organization$ref: FragmentReference;
export type Show_organization = {|
  +id: string,
  +slug: string,
  +name: string,
  +permissions: ?{|
    +pipelineCreate: ?{|
      +code: ?string,
      +allowed: boolean,
      +message: ?string,
    |}
  |},
  +$fragmentRefs: Teams_organization$ref & Pipelines_organization$ref,
  +$refType: Show_organization$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Show_organization",
  "type": "Organization",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Teams_organization",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Pipelines_organization",
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
      "name": "slug",
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
(node/*: any*/).hash = '6fdad6d803519ca23c3341de6acaa3cb';
module.exports = node;
