import Relay from 'react-relay/classic';

class TeamPipelineUpdate extends Relay.Mutation {
  static fragments = {
    teamPipeline: () => Relay.QL`
      fragment on TeamPipeline {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamPipelineUpdate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamPipelineUpdatePayload {
        teamPipeline {
          accessLevel
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        teamPipeline: this.props.teamPipeline.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.teamPipeline.id, accessLevel: this.props.accessLevel };
  }
}

export default TeamPipelineUpdate;
