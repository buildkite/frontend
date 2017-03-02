import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    pipelineSchedule(slug: $pipelineScheduleSlug)
  }
`;

export const prepareParams = (params) => {
  return {
    ...params,
    pipelineScheduleSlug: [params.organization, params.pipeline, params.schedule].join("/")
  };
};
