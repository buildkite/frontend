/**
 * @flow
 * @relayHash ee76640a199dc45f4cc1ae3753c04810
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Pipeline_pipeline$ref = any;
export type PipelineRefetchQueryVariables = {|
  id: string,
  includeGraphData: boolean,
|};
export type PipelineRefetchQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: Pipeline_pipeline$ref
  |}
|};
export type PipelineRefetchQuery = {|
  variables: PipelineRefetchQueryVariables,
  response: PipelineRefetchQueryResponse,
|};
*/


/*
query PipelineRefetchQuery(
  $id: ID!
  $includeGraphData: Boolean!
) {
  node(id: $id) {
    __typename
    ...Pipeline_pipeline_77nm2
    id
  }
}

fragment Pipeline_pipeline_77nm2 on Pipeline {
  ...Status_pipeline
  ...Metrics_pipeline
  ...Graph_pipeline_77nm2
  id
  name
  slug
  description
  defaultBranch
  url
  favorite
  permissions {
    pipelineFavorite {
      allowed
    }
  }
}

fragment Status_pipeline on Pipeline {
  id
  firstBuild: builds(first: 1, branch: "%default", state: [RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED]) {
    edges {
      node {
        state
        url
        ...BuildTooltip_build
        id
      }
    }
  }
}

fragment Metrics_pipeline on Pipeline {
  metrics(first: 6) {
    edges {
      node {
        label
        ...Metric_metric
        id
      }
    }
  }
}

fragment Graph_pipeline_77nm2 on Pipeline {
  builds(first: 30, branch: "%default", state: [SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED]) @include(if: $includeGraphData) {
    edges {
      node {
        id
        state
        url
        startedAt
        finishedAt
        canceledAt
        scheduledAt
        ...Bar_build
      }
    }
  }
}

fragment Bar_build on Build {
  ...BuildTooltip_build
}

fragment BuildTooltip_build on Build {
  message
  url
  commit
  state
  startedAt
  finishedAt
  canceledAt
  scheduledAt
  createdBy {
    __typename
    ... on User {
      name
      avatar {
        url
      }
    }
    ... on UnregisteredUser {
      maybeName: name
      avatar {
        url
      }
    }
    ... on Node {
      id
    }
  }
}

fragment Metric_metric on PipelineMetric {
  label
  value
  url
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "includeGraphData",
    "type": "Boolean!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "branch",
  "value": "%default",
  "type": "[String!]"
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "state",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "message",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "commit",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "startedAt",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "finishedAt",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "canceledAt",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "scheduledAt",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "avatar",
  "storageKey": null,
  "args": null,
  "concreteType": "Avatar",
  "plural": false,
  "selections": [
    v4
  ]
},
v15 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "createdBy",
  "storageKey": null,
  "args": null,
  "concreteType": null,
  "plural": false,
  "selections": [
    v2,
    v3,
    {
      "kind": "InlineFragment",
      "type": "UnregisteredUser",
      "selections": [
        {
          "kind": "ScalarField",
          "alias": "maybeName",
          "name": "name",
          "args": null,
          "storageKey": null
        },
        v14
      ]
    },
    {
      "kind": "InlineFragment",
      "type": "User",
      "selections": [
        v5,
        v14
      ]
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "PipelineRefetchQuery",
  "id": null,
  "text": "query PipelineRefetchQuery(\n  $id: ID!\n  $includeGraphData: Boolean!\n) {\n  node(id: $id) {\n    __typename\n    ...Pipeline_pipeline_77nm2\n    id\n  }\n}\n\nfragment Pipeline_pipeline_77nm2 on Pipeline {\n  ...Status_pipeline\n  ...Metrics_pipeline\n  ...Graph_pipeline_77nm2\n  id\n  name\n  slug\n  description\n  defaultBranch\n  url\n  favorite\n  permissions {\n    pipelineFavorite {\n      allowed\n    }\n  }\n}\n\nfragment Status_pipeline on Pipeline {\n  id\n  firstBuild: builds(first: 1, branch: \"%default\", state: [RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED]) {\n    edges {\n      node {\n        state\n        url\n        ...BuildTooltip_build\n        id\n      }\n    }\n  }\n}\n\nfragment Metrics_pipeline on Pipeline {\n  metrics(first: 6) {\n    edges {\n      node {\n        label\n        ...Metric_metric\n        id\n      }\n    }\n  }\n}\n\nfragment Graph_pipeline_77nm2 on Pipeline {\n  builds(first: 30, branch: \"%default\", state: [SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED]) @include(if: $includeGraphData) {\n    edges {\n      node {\n        id\n        state\n        url\n        startedAt\n        finishedAt\n        canceledAt\n        scheduledAt\n        ...Bar_build\n      }\n    }\n  }\n}\n\nfragment Bar_build on Build {\n  ...BuildTooltip_build\n}\n\nfragment BuildTooltip_build on Build {\n  message\n  url\n  commit\n  state\n  startedAt\n  finishedAt\n  canceledAt\n  scheduledAt\n  createdBy {\n    __typename\n    ... on User {\n      name\n      avatar {\n        url\n      }\n    }\n    ... on UnregisteredUser {\n      maybeName: name\n      avatar {\n        url\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment Metric_metric on PipelineMetric {\n  label\n  value\n  url\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "PipelineRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
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
  },
  "operation": {
    "kind": "Operation",
    "name": "PipelineRefetchQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          v2,
          v3,
          {
            "kind": "InlineFragment",
            "type": "Pipeline",
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              },
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
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "value",
                            "args": null,
                            "storageKey": null
                          },
                          v4,
                          v3
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "favorite",
                "args": null,
                "storageKey": null
              },
              v5,
              {
                "kind": "LinkedField",
                "alias": "firstBuild",
                "name": "builds",
                "storageKey": "builds(branch:\"%default\",first:1,state:[\"RUNNING\",\"CANCELING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"BLOCKED\"])",
                "args": [
                  v6,
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1,
                    "type": "Int"
                  },
                  {
                    "kind": "Literal",
                    "name": "state",
                    "value": [
                      "RUNNING",
                      "CANCELING",
                      "PASSED",
                      "FAILED",
                      "CANCELED",
                      "BLOCKED"
                    ],
                    "type": "[BuildStates!]"
                  }
                ],
                "concreteType": "BuildConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "BuildEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Build",
                        "plural": false,
                        "selections": [
                          v7,
                          v4,
                          v8,
                          v9,
                          v10,
                          v11,
                          v12,
                          v13,
                          v15,
                          v3
                        ]
                      }
                    ]
                  }
                ]
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
              v4,
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
              },
              {
                "kind": "Condition",
                "passingValue": true,
                "condition": "includeGraphData",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "builds",
                    "storageKey": "builds(branch:\"%default\",first:30,state:[\"SCHEDULED\",\"RUNNING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"CANCELING\",\"BLOCKED\"])",
                    "args": [
                      v6,
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 30,
                        "type": "Int"
                      },
                      {
                        "kind": "Literal",
                        "name": "state",
                        "value": [
                          "SCHEDULED",
                          "RUNNING",
                          "PASSED",
                          "FAILED",
                          "CANCELED",
                          "CANCELING",
                          "BLOCKED"
                        ],
                        "type": "[BuildStates!]"
                      }
                    ],
                    "concreteType": "BuildConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "BuildEdge",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "node",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Build",
                            "plural": false,
                            "selections": [
                              v3,
                              v7,
                              v4,
                              v10,
                              v11,
                              v12,
                              v13,
                              v8,
                              v9,
                              v15
                            ]
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
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9bb74518546ee0c354cc18661d1a6034';
module.exports = node;
