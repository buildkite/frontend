import Relay from 'react-relay/classic';

class PipelineScheduleUpdate extends Relay.Mutation {
  static fragments = {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        pipelineScheduleUpdate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PipelineScheduleUpdatePayload {
        pipelineSchedule {
          cronline
          label
          message
          commit
          branch
          env
          nextBuildAt
          enabled
          failedMessage
          failedAt
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        pipelineSchedule: this.props.pipelineSchedule.id
      }
    }];
  }

  getVariables() {
    return {
      id: this.props.pipelineSchedule.id,
      cronline: this.props.cronline,
      label: this.props.label,
      message: this.props.message,
      commit: this.props.commit,
      branch: this.props.branch,
      enabled: this.props.enabled,
      env: this.props.env
    };
  }
}

export default PipelineScheduleUpdate;
