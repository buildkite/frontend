import Relay from 'react-relay';
import fromGraphQL from 'react-relay/lib/fromGraphQL';

const QUERIES = {
  "organization/show": Relay.QL`
    query PipelinesList($organization: ID!, $team: ID) {
      organization(slug: $organization) {
        id
        slug
        name
        teams(first: 500) {
          edges {
            node {
              id
              name
              slug
              description
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        pipelines(first: 500, team: $team, order: PIPELINE_ORDER_NAME) {
          edges {
            node {
              id
              name
              slug
              description
              url
              favorite
              defaultBranch
              permissions {
                pipelineFavorite {
                  allowed
                }
              }
              builds(first: 1, branch: "%default", state: [ BUILD_STATE_RUNNING, BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED ]) {
                edges {
                  node {
                    id
                    state
                    message
                    startedAt
                    finishedAt
                    url
                    createdBy {
                      __typename
                      ... on User {
                        id
                        name
                        avatar {
                          url
                        }
                      }
                      ...on UnregisteredUser {
                        name
                        avatar {
                          url
                        }
                      }
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  `,
  "navigation/organization": Relay.QL`
    query NavigationOrganization($organization: ID!) {
      organization(slug: $organization) {
        name
        id
        slug
        agents {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberCreate {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamAdmin {
            allowed
          }
        }
      }
    }
  `,
  "navigation/viewer": Relay.QL`
    query NavigationViewer {
      viewer {
        user {
          name,
          avatar {
            url
          }
          id
        }
      }
    }
  `,
  "organization/settings_navigation": Relay.QL`
    query GetOrganization($organization: ID!) {
      organization(slug: $organization) {
        id
        name
        slug
        members {
          count
        }
        invitations {
          count
        }
        teams {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberCreate {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamAdmin {
            allowed
          }
          teamCreate {
            allowed
          }
        }
      }
    }
  `
};

class RelayPreloader {
  preload(id, payload, variables) {
    // Get the concrete query
    const concrete = QUERIES[id];
    if (!concrete) {
      throw "No concrete query defined for `" + id + "`";
    }

    // Create a Relay-readable GraphQL query with the variables loaded in
    const query = fromGraphQL.Query(concrete);
    query.__variables__ = variables;

    // Load it with the payload into the Relay store
    Relay.Store.getStoreData().handleQueryPayload(query, payload);
  }
}

export default new RelayPreloader();
