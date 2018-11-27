/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type Pipeline_pipeline$ref = any;
type ShowMoreFooter_connection$ref = any;
type Welcome_organization$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Pipelines_organization$ref: FragmentReference;
export type Pipelines_organization = {|
  +id: string,
  +slug: string,
  +allPipelines: ?{|
    +count: number
  |},
  +pipelines: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +name: string,
        +description: ?string,
        +favorite: boolean,
        +$fragmentRefs: Pipeline_pipeline$ref,
      |}
    |}>,
    +$fragmentRefs: ShowMoreFooter_connection$ref,
  |},
  +$fragmentRefs: Welcome_organization$ref,
  +$refType: Pipelines_organization$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "Variable",
  "name": "team",
  "variableName": "teamSearch",
  "type": "TeamSelector"
};
return {
  "kind": "Fragment",
  "name": "Pipelines_organization",
  "type": "Organization",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "teamSearch",
      "type": "TeamSelector",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "includeGraphData",
      "type": "Boolean",
      "defaultValue": false
    },
    {
      "kind": "LocalArgument",
      "name": "pageSize",
      "type": "Int",
      "defaultValue": 30
    },
    {
      "kind": "LocalArgument",
      "name": "pipelineFilter",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Welcome_organization",
      "args": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "allPipelines",
      "name": "pipelines",
      "storageKey": null,
      "args": [
        v1
      ],
      "concreteType": "PipelineConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "count",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "pipelines",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "pageSize",
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "order",
          "value": "NAME_WITH_FAVORITES_FIRST",
          "type": "PipelineOrders"
        },
        {
          "kind": "Variable",
          "name": "search",
          "variableName": "pipelineFilter",
          "type": "String"
        },
        v1
      ],
      "concreteType": "PipelineConnection",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ShowMoreFooter_connection",
          "args": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "PipelineEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Pipeline",
              "plural": false,
              "selections": [
                v0,
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
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "favorite",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Pipeline_pipeline",
                  "args": [
                    {
                      "kind": "Variable",
                      "name": "includeGraphData",
                      "variableName": "includeGraphData",
                      "type": null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd8f8bfefcd9578b42512adfdc5d3ffa4';
module.exports = node;
