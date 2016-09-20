import Relay from 'react-relay';

class PipelineScheduleCreate extends Relay.Mutation {
  static fragments = {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        pipelineScheduleCreate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PipelineScheduleCreatePayload {
        pipelineScheduleEdge,
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
          fragment on PipelineScheduleCreatePayload {
            pipelineScheduleEdge {
              node {
                uuid
                pipeline {
                  schedules {
                    count
                  }
                }
              }
            }
          }
        `
      ]
    }, {
      type: 'RANGE_ADD',
      parentName: 'pipeline',
      parentID: this.props.pipeline.id,
      connectionName: 'schedules',
      edgeName: 'pipelineScheduleEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];
  }

  getVariables() {
    return {
      pipelineID: this.props.pipeline.id,
      cronline: this.props.cronline,
      label: this.props.label,
      message: this.props.message,
      commit: this.props.commit,
      branch: this.props.branch,
      env: this.props.env
    };
  }
}

export default PipelineScheduleCreate;
