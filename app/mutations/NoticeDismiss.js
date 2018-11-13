import Relay from 'react-relay/compat';

class NoticeDismiss extends Relay.Mutation {
  static fragments = {
    notice: () => Relay.QL`
      fragment on Notice {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        noticeDismiss
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on NoticeDismissPayload {
        notice {
          dismissedAt
        }
      }
    `;
  }

  getOptimisticResponse() {
    return {
      notice: {
        id: this.props.notice.id,
        dismissedAt: (new Date()).toString()
      }
    };
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        notice: this.props.notice.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.notice.id };
  }
}

export default NoticeDismiss;
