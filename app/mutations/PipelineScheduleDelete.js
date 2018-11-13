import Relay from 'react-relay/compat';

class PipelineScheduleDelete extends Relay.Mutation {
  static fragments = {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        id
        pipeline {
          id
        }
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        pipelineScheduleDelete
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PipelineScheduleDeletePayload {
        deletedPipelineScheduleID,
        pipeline {
          schedules {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on PipelineScheduleDeletePayload {
            pipeline {
              schedules {
                count
              }
            }
          }
        `
      ]
    }, {
      type: 'NODE_DELETE',
      parentName: 'pipeline',
      parentID: this.props.pipelineSchedule.pipeline.id,
      connectionName: 'schedules',
      deletedIDFieldName: 'deletedPipelineScheduleID'
    }];
  }

  getVariables() {
    return { id: this.props.pipelineSchedule.id };
  }
}

export default PipelineScheduleDelete;
