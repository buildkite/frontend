import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    agent(slug: $slug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    slug: [params.organization, params.agent].join("/")
  };
};
