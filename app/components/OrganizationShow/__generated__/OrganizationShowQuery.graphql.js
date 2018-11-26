/**
 * @flow
 * @relayHash 707afce9a7f1d58fca579c27c5a2e186
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type OrganizationShowQueryVariables = {|
  organizationSlug: string
|};
export type OrganizationShowQueryResponse = {|
  +organization: ?{|
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
  |}
|};
export type OrganizationShowQuery = {|
  variables: OrganizationShowQueryVariables,
  response: OrganizationShowQueryResponse,
|};
*/


/*
query OrganizationShowQuery(
  $organizationSlug: ID!
) {
  organization(slug: $organizationSlug) {
    id
    slug
    name
    permissions {
      pipelineCreate {
        code
        allowed
        message
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "organizationSlug",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "organization",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "slug",
        "variableName": "organizationSlug",
        "type": "ID!"
      }
    ],
    "concreteType": "Organization",
    "plural": false,
    "selections": [
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
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "OrganizationShowQuery",
  "id": null,
  "text": "query OrganizationShowQuery(\n  $organizationSlug: ID!\n) {\n  organization(slug: $organizationSlug) {\n    id\n    slug\n    name\n    permissions {\n      pipelineCreate {\n        code\n        allowed\n        message\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OrganizationShowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "OrganizationShowQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'abe759da9dea6f48998d19d8e0f4875c';
module.exports = node;
