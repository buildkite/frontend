/**
 * @flow
 * @relayHash dfbe55cbd08b1d0f0b731858bf38a63a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GraphQLSnippetCreateInput = {
  clientMutationId?: ?string,
  query: string,
  operationName?: ?string,
};
export type GraphQLExplorerConsole_graphQLSnippetCreateMutationVariables = {|
  input: GraphQLSnippetCreateInput
|};
export type GraphQLExplorerConsole_graphQLSnippetCreateMutationResponse = {|
  +graphQLSnippetCreate: ?{|
    +graphQLSnippet: {|
      +url: string
    |}
  |}
|};
export type GraphQLExplorerConsole_graphQLSnippetCreateMutation = {|
  variables: GraphQLExplorerConsole_graphQLSnippetCreateMutationVariables,
  response: GraphQLExplorerConsole_graphQLSnippetCreateMutationResponse,
|};
*/


/*
mutation GraphQLExplorerConsole_graphQLSnippetCreateMutation(
  $input: GraphQLSnippetCreateInput!
) {
  graphQLSnippetCreate(input: $input) {
    graphQLSnippet {
      url
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "GraphQLSnippetCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "GraphQLSnippetCreateInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
  "id": null,
  "text": "mutation GraphQLExplorerConsole_graphQLSnippetCreateMutation(\n  $input: GraphQLSnippetCreateInput!\n) {\n  graphQLSnippetCreate(input: $input) {\n    graphQLSnippet {\n      url\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "graphQLSnippetCreate",
        "storageKey": null,
        "args": v1,
        "concreteType": "GraphQLSnippetCreatePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "graphQLSnippet",
            "storageKey": null,
            "args": null,
            "concreteType": "GraphQLSnippet",
            "plural": false,
            "selections": [
              v2
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "graphQLSnippetCreate",
        "storageKey": null,
        "args": v1,
        "concreteType": "GraphQLSnippetCreatePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "graphQLSnippet",
            "storageKey": null,
            "args": null,
            "concreteType": "GraphQLSnippet",
            "plural": false,
            "selections": [
              v2,
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
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '91530c3ac2a4d6226651e1b310b791f7';
module.exports = node;
