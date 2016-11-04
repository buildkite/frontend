import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    pipeline(slug: $slug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    slug: [params.organization, params.pipeline].join("/")
  };
};
