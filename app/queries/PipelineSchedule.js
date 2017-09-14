// @flow

import Relay from 'react-relay/classic';

// Note: Ensure whatever variable you use as the $slug is unique and doesn't
// match any existing variables in any other queries otherwise React Relay
// Router doesn't work very well.

export const query = () => Relay.QL`
  query {
    pipelineSchedule(slug: $pipelineScheduleSlug)
  }
`;

export const prepareParams = (params: Object) => {
  return {
    ...params,
    pipelineScheduleSlug: [params.organization, params.pipeline, params.schedule].join("/")
  };
};
