import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    organizationMember(slug: $organizationMember)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    slug: [params.organization, params.organizationMember].join("/")
  };
};
