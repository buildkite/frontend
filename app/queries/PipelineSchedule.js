import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    pipelineSchedule(slug: $slug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    slug: [params.organization, params.pipeline, params.schedule].join("/")
  };
};
