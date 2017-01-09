import Relay from 'react-relay';

class EmailCreate extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `
  }

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

  getOptimisticResponse() {
    return {
      emailEdge: {
        node: {
          id: (new Date()).toString(),
          address: this.props.address,
          primary: false,
          verified: false
        }
      },
      viewer: this.props.viewer
    };
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
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
