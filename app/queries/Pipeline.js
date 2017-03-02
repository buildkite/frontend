import Relay from 'react-relay';

// Note: Ensure whatever variable you use as the $slug is unique and doesn't
// match any existing variables in any other queries otherwise React Relay
// Router doesn't work very well.

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
