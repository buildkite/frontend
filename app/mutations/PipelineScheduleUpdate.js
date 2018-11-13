import Relay from 'react-relay/compat';

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
          ownedBy
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
    const variables = {
      id: this.props.pipelineSchedule.id,
      cronline: this.props.cronline,
      label: this.props.label,
      message: this.props.message,
      commit: this.props.commit,
      branch: this.props.branch,
      enabled: this.props.enabled,
      env: this.props.env
    };

    if (this.props.ownedBy) {
      variables.ownedById = this.props.ownedBy.id;
    }

    return variables;
  }
}

export default PipelineScheduleUpdate;
