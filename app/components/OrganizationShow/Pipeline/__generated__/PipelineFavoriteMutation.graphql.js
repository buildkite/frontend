/**
 * @flow
 * @relayHash 5f58c13866c7af0f69efd7dbc92dd56b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PipelineFavoriteInput = {
  clientMutationId?: ?string,
  id: string,
  favorite: boolean,
};
export type PipelineFavoriteMutationVariables = {|
  input: PipelineFavoriteInput
|};
export type PipelineFavoriteMutationResponse = {|
  +pipelineFavorite: ?{|
    +pipeline: ?{|
      +favorite: boolean
    |}
  |}
|};
export type PipelineFavoriteMutation = {|
  variables: PipelineFavoriteMutationVariables,
  response: PipelineFavoriteMutationResponse,
|};
*/


/*
mutation PipelineFavoriteMutation(
  $input: PipelineFavoriteInput!
) {
  pipelineFavorite(input: $input) {
    pipeline {
      favorite
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
    "type": "PipelineFavoriteInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "PipelineFavoriteInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "favorite",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "PipelineFavoriteMutation",
  "id": null,
  "text": "mutation PipelineFavoriteMutation(\n  $input: PipelineFavoriteInput!\n) {\n  pipelineFavorite(input: $input) {\n    pipeline {\n      favorite\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "PipelineFavoriteMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "pipelineFavorite",
        "storageKey": null,
        "args": v1,
        "concreteType": "PipelineFavoritePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "pipeline",
            "storageKey": null,
            "args": null,
            "concreteType": "Pipeline",
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
    "name": "PipelineFavoriteMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "pipelineFavorite",
        "storageKey": null,
        "args": v1,
        "concreteType": "PipelineFavoritePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "pipeline",
            "storageKey": null,
            "args": null,
            "concreteType": "Pipeline",
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
(node/*: any*/).hash = '21e3f9640ef365d26e3736b56341360d';
module.exports = node;
