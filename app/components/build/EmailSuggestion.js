import React from 'react';
import Relay from 'react-relay';

import NoticeDismissMutation from '../../mutations/NoticeDismiss';
import FlashesStore from '../../stores/FlashesStore';

class EmailSuggestion extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      notice: React.PropTypes.object
    }).isRequired
  };

  didReceiveProps(newProps) {
    if(!newProps.viewer.emails.include?(newProps.build.createdBy.email)) {
      this.props.relay.setVariables({isShowingNotice: true, email: newProps.build.createdBy.email})
    }
  }

  render() {
    if(this.props.notice && !this.props.notice.dismissedAt) {
      return (
        <div>Add me please</div>
      )
    }
  }

  handleDismissClick = () => {
    const mutation = new NoticeDismissMutation({ notice: this.props.viewer.notice });

    Relay.Store.commitUpdate(mutation, { onFailure: this.handleNoticeDismissMutationFailure });
  };

  handleNoticeDismissMutationFailure = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(EmailSuggestion, {
  initialVariables: {
    email: null,
    isShowingNotice: false
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        emails {
          address
        }
        notice(namespace: NOTICE_NAMESPACE_FEATURE, scope: $email) @include($if: $isShowingNotice) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `,
   build: () => Relay.QL`
      fragment on Build {
        createdBy {
          ...on UnregisteredUser {
            email
          }
        }
      }
    `
  }
});
