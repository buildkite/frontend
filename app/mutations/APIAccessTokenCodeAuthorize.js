import Relay from 'react-relay/classic';

class APIAccessTokenCodeAuthorize extends Relay.Mutation {
  static fragments = {
    apiAccessTokenCode: () => Relay.QL`
      fragment on APIAccessTokenCode {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        apiAccessTokenCodeAuthorize
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on APIAccessTokenCodeAuthorizeMutationPayload {
        apiAccessTokenCode {
          authorizedAt
          authorizedIPAddress
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        apiAccessTokenCode: this.props.apiAccessTokenCode.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.apiAccessTokenCode.id };
  }
}

export default APIAccessTokenCodeAuthorize;
