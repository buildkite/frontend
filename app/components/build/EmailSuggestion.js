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

  render() {
    console.log(this.props.viewer)
    console.log(this.props.build)
    return (
      <div>hello</div>
    )
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
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        emails {
          address
        }
        notice(namespace: NOTICE_NAMESPACE_FEATURE, scope: "blah") {
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
