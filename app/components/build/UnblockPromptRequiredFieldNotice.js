import React from 'react';
import Relay from 'react-relay';

import Emojify from '../shared/Emojify';
import Button from '../shared/Button';

import NoticeDismissMutation from '../../mutations/NoticeDismiss';
import FlashesStore from '../../stores/FlashesStore';

class UnblockPromptRequiredFieldNotice extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      notice: React.PropTypes.object.isRequired
    }).isRequired
  };

  render() {
    if (this.props.viewer.notice.dismissedAt) {
      return null;
    } else {
      return (
        <div className="border border-blue blue rounded mt4 ml4 mr4 p3" stlye={{width: 408}}>
          <div><Emojify text=":wave:" /> Hey, we just wanted to give you a heads up that all fields in an unblock prompt are now requried by default unless you specify <code>required: false</code> in the field.</div>
          <div className="center mt2">
            <Button theme={"primary"} outline={true} onClick={this.handleDismissClick}>Ok, got it!</Button>
          </div>
        </div>
      );
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

export default Relay.createContainer(UnblockPromptRequiredFieldNotice, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        notice(namespace: NOTICE_NAMESPACE_FEATURE, scope: "unblock-prompt-required-fields") {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
