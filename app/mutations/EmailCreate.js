import Relay from 'react-relay';

class EmailCreate extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        emailCreate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EmailCreatePayload {
        emailEdge
        viewer {
          emails {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      connectionName: 'emails',
      edgeName: 'emailEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];
  }

  getVariables() {
    return { address: this.props.address };
  }
}

export default EmailCreate;
