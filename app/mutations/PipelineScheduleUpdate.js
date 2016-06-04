import Relay from 'react-relay';

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
          description
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
      description: this.props.description,
      message: this.props.message,
      commit: this.props.commit,
      branch: this.props.branch,
      env: this.props.env
    };
  }
}

export default PipelineScheduleUpdate;
