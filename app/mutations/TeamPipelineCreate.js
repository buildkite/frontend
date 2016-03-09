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
	teamPipelineEdge,
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
          pipeline: this.props.pipeline
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
      rangeBehaviors: {
	'': 'append'
      }
    }];
  }

  getVariables() {
    return { teamID: this.props.team.id, pipelineID: this.props.pipeline.id };
  }
}

export default TeamPipelineCreate;
