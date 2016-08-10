import Relay from 'react-relay';
import fromGraphQL from 'react-relay/lib/fromGraphQL';

const QUERIES = {
  "organization/show": Relay.QL`
    query PipelinesList($organization: ID!, $teamsCount: Int!) {
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
