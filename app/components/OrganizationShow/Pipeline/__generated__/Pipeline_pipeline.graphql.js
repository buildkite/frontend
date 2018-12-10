/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type Graph_pipeline$ref = any;
type Metrics_pipeline$ref = any;
type Status_pipeline$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Pipeline_pipeline$ref: FragmentReference;
export type Pipeline_pipeline = {|
  +id: string,
  +name: string,
  +slug: string,
  +description: ?string,
  +defaultBranch: string,
  +url: string,
  +favorite: boolean,
  +permissions: ?{|
    +pipelineFavorite: ?{|
      +allowed: boolean
    |}
  |},
  +$fragmentRefs: Status_pipeline$ref & Metrics_pipeline$ref & Graph_pipeline$ref,
  +$refType: Pipeline_pipeline$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Pipeline_pipeline",
  "type": "Pipeline",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "includeGraphData",
      "type": "Boolean!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Status_pipeline",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Graph_pipeline",
      "args": [
        {
          "kind": "Variable",
          "name": "includeGraphData",
          "variableName": "includeGraphData",
          "type": null
        }
      ]
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Metrics_pipeline",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "defaultBranch",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "favorite",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "permissions",
      "storageKey": null,
      "args": null,
      "concreteType": "PipelinePermissions",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pipelineFavorite",
          "storageKey": null,
          "args": null,
          "concreteType": "Permission",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "allowed",
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
(node/*: any*/).hash = '654881b3b852009fbeecf56cc098439a';
module.exports = node;
