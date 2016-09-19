import Relay from 'react-relay';

class AgentStop extends Relay.Mutation {
  static fragments = {
    agent: () => Relay.QL`
      fragment on Agent {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        agentStop
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AgentStopPayload {
        agent {
          connectionState
          disconnectedAt
          stoppedAt
          stoppedBy {
            name
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        agent: this.props.agent.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.agent.id, graceful: this.props.graceful };
  }
}

export default AgentStop;
