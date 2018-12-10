/**
 * @flow
 * @relayHash 076300efe7462dbdeeecb47f5c9490d2
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Pipelines_organization$ref = any;
type Teams_organization$ref = any;
export type OrganizationShowQueryVariables = {|
  organizationSlug: string,
  teamSearch?: ?any,
  pageSize: number,
  pipelineFilter?: ?string,
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
    +$fragmentRefs: Teams_organization$ref & Pipelines_organization$ref,
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
  $teamSearch: TeamSelector
  $pageSize: Int!
  $pipelineFilter: String
) {
  organization(slug: $organizationSlug) {
    ...Teams_organization
    ...Pipelines_organization_12c8MI
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

fragment Teams_organization on Organization {
  teams(first: 100) {
    edges {
      node {
        id
        name
        slug
        description
        permissions {
          pipelineView {
            allowed
          }
        }
      }
    }
  }
}

fragment Pipelines_organization_12c8MI on Organization {
  ...Welcome_organization
  id
  slug
  allPipelines: pipelines(team: $teamSearch) {
    count
  }
  pipelines(search: $pipelineFilter, first: $pageSize, team: $teamSearch, order: NAME_WITH_FAVORITES_FIRST) {
    ...ShowMoreFooter_connection
    edges {
      node {
        id
        name
        description
        favorite
        ...Pipeline_pipeline_1BBA2j
      }
    }
  }
}

fragment Welcome_organization on Organization {
  slug
  permissions {
    pipelineCreate {
      code
      allowed
      message
    }
  }
}

fragment ShowMoreFooter_connection on Connection {
  pageInfo {
    hasNextPage
  }
}

fragment Pipeline_pipeline_1BBA2j on Pipeline {
  ...Status_pipeline
  ...Metrics_pipeline
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

fragment Metric_metric on PipelineMetric {
  label
  value
  url
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "organizationSlug",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "teamSearch",
    "type": "TeamSelector",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "pageSize",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "pipelineFilter",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "organizationSlug",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "allowed",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "message",
  "args": null,
  "storageKey": null
},
v7 = {
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
        v5,
        v6
      ]
    }
  ]
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "description",
  "args": null,
  "storageKey": null
},
v9 = [
  v5
],
v10 = {
  "kind": "Variable",
  "name": "team",
  "variableName": "teamSearch",
  "type": "TeamSelector"
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "avatar",
  "storageKey": null,
  "args": null,
  "concreteType": "Avatar",
  "plural": false,
  "selections": [
    v11
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "OrganizationShowQuery",
  "id": null,
  "text": "query OrganizationShowQuery(\n  $organizationSlug: ID!\n  $teamSearch: TeamSelector\n  $pageSize: Int!\n  $pipelineFilter: String\n) {\n  organization(slug: $organizationSlug) {\n    ...Teams_organization\n    ...Pipelines_organization_12c8MI\n    id\n    slug\n    name\n    permissions {\n      pipelineCreate {\n        code\n        allowed\n        message\n      }\n    }\n  }\n}\n\nfragment Teams_organization on Organization {\n  teams(first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        permissions {\n          pipelineView {\n            allowed\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment Pipelines_organization_12c8MI on Organization {\n  ...Welcome_organization\n  id\n  slug\n  allPipelines: pipelines(team: $teamSearch) {\n    count\n  }\n  pipelines(search: $pipelineFilter, first: $pageSize, team: $teamSearch, order: NAME_WITH_FAVORITES_FIRST) {\n    ...ShowMoreFooter_connection\n    edges {\n      node {\n        id\n        name\n        description\n        favorite\n        ...Pipeline_pipeline_1BBA2j\n      }\n    }\n  }\n}\n\nfragment Welcome_organization on Organization {\n  slug\n  permissions {\n    pipelineCreate {\n      code\n      allowed\n      message\n    }\n  }\n}\n\nfragment ShowMoreFooter_connection on Connection {\n  pageInfo {\n    hasNextPage\n  }\n}\n\nfragment Pipeline_pipeline_1BBA2j on Pipeline {\n  ...Status_pipeline\n  ...Metrics_pipeline\n  id\n  name\n  slug\n  description\n  defaultBranch\n  url\n  favorite\n  permissions {\n    pipelineFavorite {\n      allowed\n    }\n  }\n}\n\nfragment Status_pipeline on Pipeline {\n  id\n  firstBuild: builds(first: 1, branch: \"%default\", state: [RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED]) {\n    edges {\n      node {\n        state\n        url\n        ...BuildTooltip_build\n        id\n      }\n    }\n  }\n}\n\nfragment Metrics_pipeline on Pipeline {\n  metrics(first: 6) {\n    edges {\n      node {\n        label\n        ...Metric_metric\n        id\n      }\n    }\n  }\n}\n\nfragment Metric_metric on PipelineMetric {\n  label\n  value\n  url\n}\n\nfragment BuildTooltip_build on Build {\n  message\n  url\n  commit\n  state\n  startedAt\n  finishedAt\n  canceledAt\n  scheduledAt\n  createdBy {\n    __typename\n    ... on User {\n      name\n      avatar {\n        url\n      }\n    }\n    ... on UnregisteredUser {\n      maybeName: name\n      avatar {\n        url\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OrganizationShowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "organization",
        "storageKey": null,
        "args": v1,
        "concreteType": "Organization",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Teams_organization",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "Pipelines_organization",
            "args": [
              {
                "kind": "Variable",
                "name": "pageSize",
                "variableName": "pageSize",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "pipelineFilter",
                "variableName": "pipelineFilter",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "teamSearch",
                "variableName": "teamSearch",
                "type": null
              }
            ]
          },
          v2,
          v3,
          v4,
          v7
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "OrganizationShowQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "organization",
        "storageKey": null,
        "args": v1,
        "concreteType": "Organization",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "teams",
            "storageKey": "teams(first:100)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100,
                "type": "Int"
              }
            ],
            "concreteType": "TeamConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "TeamEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Team",
                    "plural": false,
                    "selections": [
                      v2,
                      v4,
                      v3,
                      v8,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "permissions",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "TeamPermissions",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "pipelineView",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Permission",
                            "plural": false,
                            "selections": v9
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          v3,
          v7,
          v2,
          {
            "kind": "LinkedField",
            "alias": "allPipelines",
            "name": "pipelines",
            "storageKey": null,
            "args": [
              v10
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
              v10
            ],
            "concreteType": "PipelineConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
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
                      v2,
                      v4,
                      v8,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "favorite",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "firstBuild",
                        "name": "builds",
                        "storageKey": "builds(branch:\"%default\",first:1,state:[\"RUNNING\",\"CANCELING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"BLOCKED\"])",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "branch",
                            "value": "%default",
                            "type": "[String!]"
                          },
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
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "state",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  v11,
                                  v6,
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "commit",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "startedAt",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "finishedAt",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "canceledAt",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "scheduledAt",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "createdBy",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": null,
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "__typename",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      v2,
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
                                          v12
                                        ]
                                      },
                                      {
                                        "kind": "InlineFragment",
                                        "type": "User",
                                        "selections": [
                                          v4,
                                          v12
                                        ]
                                      }
                                    ]
                                  },
                                  v2
                                ]
                              }
                            ]
                          }
                        ]
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
                                  v11,
                                  v2
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v3,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "defaultBranch",
                        "args": null,
                        "storageKey": null
                      },
                      v11,
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
                            "selections": v9
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          v4
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '152d0cff17f4bc3e3e29b4b156649b70';
module.exports = node;
