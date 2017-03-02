import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    agent(slug: $agentSlug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    agentSlug: [params.organization, params.agent].join("/")
  };
};
