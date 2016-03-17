import Relay from 'react-relay';

class TeamPipelineDelete extends Relay.Mutation {
  static fragments = {
    teamPipeline: () => Relay.QL`
      fragment on TeamPipeline {
        id
        team {
          id
        }
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamPipelineDelete
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamPipelineDeletePayload {
        deletedTeamPipelineID,
        team {
          pipelines {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'team',
      parentID: this.props.teamPipeline.team.id,
      connectionName: 'pipelines',
      deletedIDFieldName: 'deletedTeamPipelineID'
    }];
  }

  getVariables() {
    return { id: this.props.teamPipeline.id, force: this.props.force };
  }
}

export default TeamPipelineDelete;
