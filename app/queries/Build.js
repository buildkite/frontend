import Relay from 'react-relay/classic';

// Note: Ensure whatever variable you use as the $slug is unique and doesn't
// match any existing variables in any other queries otherwise React Relay
// Router doesn't work very well.

export const query = () => Relay.QL`
  query {
    build(slug: $buildSlug)
  }
`;

// Since relay doesn't currently support root fields with multiple
// parameters, it means we can't have queries like: build(org: "...",
// pipeline: "...", number: "12"), so we have to do this hacky thing where we
// include them all in the `buildSlug` param.
export const prepareParams = (params) => {
  return {
    ...params,
    buildSlug: [params.organization, params.pipeline, params.number].join("/")
  };
};
