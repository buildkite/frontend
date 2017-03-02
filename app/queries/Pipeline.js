import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    pipeline(slug: $pipelineSlug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    pipelineSlug: [params.organization, params.pipeline].join("/")
  };
};
