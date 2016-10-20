import Relay from 'react-relay';

class TeamPipelineCreate extends Relay.Mutation {
  static fragments = {
    team: () => Relay.QL`
      fragment on Team {
        id
        pipelines {
          count
        }
      }
    `,
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        teams {
          count
        }
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamPipelineCreate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamPipelineCreatePayload {
        teamPipelineEdge
        pipeline {
          teams {
            count
          }
        }
        team {
          pipelines {
            count
          }
        }
      }
    `;
  }

  getOptimisticResponse() {
    return {
      teamPipelineEdge: {
        node: {
          pipeline: this.props.pipeline,
          team: this.props.team
        }
      },
      pipeline: {
        teams: {
          count: this.props.pipeline.teams.count + 1
        }
      },
      team: {
        pipelines: {
          count: this.props.team.pipelines.count + 1
        }
      }
    };
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'team',
      parentID: this.props.team.id,
      connectionName: 'pipelines',
      edgeName: 'teamPipelineEdge',
      rangeBehaviors: () => 'prepend'
    }, {
      type: 'RANGE_ADD',
      parentName: 'pipeline',
      parentID: this.props.pipeline.id,
      connectionName: 'teams',
      edgeName: 'teamPipelineEdge',
      rangeBehaviors: () => 'append'
    }];
  }

  getVariables() {
    return { teamID: this.props.team.id, pipelineID: this.props.pipeline.id };
  }
}

export default TeamPipelineCreate;
