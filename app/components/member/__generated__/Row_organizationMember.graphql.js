/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type OrganizationMemberRole = "ADMIN" | "MEMBER" | "%future added value";
export type OrganizationMemberSSOModeEnum = "OPTIONAL" | "REQUIRED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Row_organizationMember$ref: FragmentReference;
export type Row_organizationMember = {|
  +uuid: string,
  +role: OrganizationMemberRole,
  +sso: {|
    +mode: ?OrganizationMemberSSOModeEnum
  |},
  +security: {|
    +twoFactorEnabled: boolean
  |},
  +user: ?{|
    +name: ?string,
    +email: string,
    +avatar: ?{|
      +url: string
    |},
  |},
  +$refType: Row_organizationMember$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Row_organizationMember",
  "type": "OrganizationMember",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "role",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sso",
      "storageKey": null,
      "args": null,
      "concreteType": "OrganizationMemberSSO",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "mode",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "security",
      "storageKey": null,
      "args": null,
      "concreteType": "OrganizationMemberSecurity",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "twoFactorEnabled",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "user",
      "storageKey": null,
      "args": null,
      "concreteType": "User",
      "plural": false,
      "selections": [
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
          "name": "email",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "avatar",
          "storageKey": null,
          "args": null,
          "concreteType": "Avatar",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
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
(node/*: any*/).hash = '2e02ba3951cb72e6cff4bde2805e0b76';
module.exports = node;
