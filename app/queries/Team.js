import Relay from 'react-relay';

// Note: Ensure whatever variable you use as the $slug is unique and doesn't
// match any existing variables in any other queries otherwise React Relay
// Router doesn't work very well.

export const query = () => Relay.QL`
  query {
    team(slug: $teamSlug)
  }
`;

export const prepareParams = (params) => {
  // Send through `isEveryoneTeam` as a variable to the compoent, so we can
  // dynamically decide whether or not to do a GraphQL for all the members.
  // If we don't set it at this level, we'd need to do a GraphQL to get the
  // team, see if it's the "everyone" team, and then decide to do another
  // query to get the members.
  return {
    ...params,
    teamSlug: [params.organization, params.team].join("/"),
    isEveryoneTeam: params.team === "everyone"
  };
};
