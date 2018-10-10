/**
 * @flow
 * @relayHash 36bb8372865d04f4ddc7276c6a56909f
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type GraphQLExplorerConsole_graphQLSnippetCreateMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    query: string;
    operationName?: ?string;
  };
|};
export type GraphQLExplorerConsole_graphQLSnippetCreateMutationResponse = {|
  +graphQLSnippetCreate: ?{|
    +graphQLSnippet: {|
      +url: string;
    |};
  |};
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

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "GraphQLSnippetCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "GraphQLSnippetCreateInput!"
          }
        ],
        "concreteType": "GraphQLSnippetCreatePayload",
        "name": "graphQLSnippetCreate",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "GraphQLSnippet",
            "name": "graphQLSnippet",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "GraphQLSnippetCreateInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "GraphQLExplorerConsole_graphQLSnippetCreateMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "GraphQLSnippetCreateInput!"
          }
        ],
        "concreteType": "GraphQLSnippetCreatePayload",
        "name": "graphQLSnippetCreate",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "GraphQLSnippet",
            "name": "graphQLSnippet",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "url",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation GraphQLExplorerConsole_graphQLSnippetCreateMutation(\n  $input: GraphQLSnippetCreateInput!\n) {\n  graphQLSnippetCreate(input: $input) {\n    graphQLSnippet {\n      url\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
