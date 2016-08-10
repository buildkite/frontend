import Relay from 'react-relay';
import fromGraphQL from 'react-relay/lib/fromGraphQL';

const QUERIES = {
  "organization/show": Relay.QL`
    query($organization: ID!, $teamsCount: Int!) {
      organization(slug: $organization) {
        id
        slug
        name
        teams(first: $teamsCount) {
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
      }
    }
  `,
  "navigation/viewer": Relay.QL`
    query($organizationsCount: Int!) {
      viewer {
        user {
          id
          name
          avatar {
            url
          }
        }
        organizations(first: $organizationsCount) {
          edges {
            node {
              id
              name
              slug
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        unreadChangelogs: changelogs(read: false) {
          count
        }
        runningBuilds: builds(state: BUILD_STATE_RUNNING) {
          count
        }
        scheduledBuilds: builds(state: BUILD_STATE_SCHEDULED) {
          count
        }
      }
    }
  `,
  "navigation/organization": Relay.QL`
    query($organization: ID!) {
      organization(slug: $organization) {
        id
        slug
        name
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
    let concrete = QUERIES[id];
    if(!concrete) {
      throw "No concrete query defined for `" + id + "`";
    }

    // Create a Relay-readable GraphQL query with the variables loaded in
    let query = fromGraphQL.Query(concrete);
    query.__variables__ = variables;

    // Load it with the payload into the Relay store
    Relay.Store.getStoreData().handleQueryPayload(query, payload);
  }
}

export default new RelayPreloader()
