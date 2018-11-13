// @flow

import Relay from 'react-relay/compat';

// Note: Ensure whatever variable you use as the $slug is unique and doesn't
// match any existing variables in any other queries otherwise React Relay
// Router doesn't work very well.

export const query = () => Relay.QL`
  query {
    organizationMember(slug: $organizationMemberSlug)
  }
`;

export const prepareParams = (params: Object) => {
  return {
    ...params,
    organizationMemberSlug: [params.organization, params.organizationMember].join("/")
  };
};
