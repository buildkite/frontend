import Relay from 'react-relay';

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
