import Relay from 'react-relay';

class EmailResendVerification extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        emailResendVerification
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EmailResendVerificationPayload {
        email
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        email: this.props.email.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.email.id };
  }
}

export default EmailResendVerification;
