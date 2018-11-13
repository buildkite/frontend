import Relay from 'react-relay/classic';

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

  /*
  Disabling graphql/no-deprecated-fields here as I think there is some changes probably
  required in the graph implementation so that we can actually use the alternatives to
  `pingedAt`, `stoppedAt`, & `stoppedBy` fields as at the moment it seems like using these
  fields will mean we need do a lot of extra fetching and checking on the client which
  seems bad?
  */
  /* eslint-disable graphql/no-deprecated-fields */
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
  /* eslint-enable graphql/no-deprecated-fields */

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
