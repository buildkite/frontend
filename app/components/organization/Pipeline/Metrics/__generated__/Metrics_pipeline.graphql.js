/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type Metric_metric$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Metrics_pipeline$ref: FragmentReference;
export type Metrics_pipeline = {|
  +metrics: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +label: string,
        +$fragmentRefs: Metric_metric$ref,
      |}
    |}>
  |},
  +$refType: Metrics_pipeline$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "Metrics_pipeline",
  "type": "Pipeline",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "metrics",
      "storageKey": "metrics(first:6)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 6,
          "type": "Int"
        }
      ],
      "concreteType": "PipelineMetricConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "PipelineMetricEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "PipelineMetric",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "label",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Metric_metric",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '671b5cf743fc3592b40912b4721de9e0';
module.exports = node;
