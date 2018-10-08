/**
 * @flow
 * @relayHash aff75651851136eb6a94e48626235f03
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type configureDeleteMutationVariables = {|
  input: {
    clientMutationId?: ?string;
    id: string;
  };
|};
export type configureDeleteMutationResponse = {|
  +totpDelete: ?{|
    +clientMutationId: ?string;
  |};
|};
*/


/*
mutation configureDeleteMutation(
  $input: TOTPDeleteInput!
) {
  totpDelete(input: $input) {
    clientMutationId
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPDeleteInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "configureDeleteMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "TOTPDeleteInput!"
          }
        ],
        "concreteType": "TOTPDeletePayload",
        "name": "totpDelete",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "clientMutationId",
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
  "name": "configureDeleteMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "TOTPDeleteInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "configureDeleteMutation",
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
            "type": "TOTPDeleteInput!"
          }
        ],
        "concreteType": "TOTPDeletePayload",
        "name": "totpDelete",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "clientMutationId",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation configureDeleteMutation(\n  $input: TOTPDeleteInput!\n) {\n  totpDelete(input: $input) {\n    clientMutationId\n  }\n}\n"
};

module.exports = batch;
