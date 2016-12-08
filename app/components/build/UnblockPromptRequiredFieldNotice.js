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
        <div className="border border-blue blue rounded mb4" style={{width: 408}}>
          <div className="p3">
            <div>
              <div className="center bold mb3"><Emojify text=":construction:" /> Beta Note from the Buildkite Team</div>
              <div>We’ve changed all fields to be required by default. If you need to make a field optional again, simply add <code>required: false</code> to your pipeline.yml. See the <a href="/docs/agent/cli-pipeline#click-to-unblock-steps" className="underline">updated documentation</a> for more info.</div>
            </div>
            <div className="center mt4">
              <Button theme={"primary"} outline={true} onClick={this.handleDismissClick} style={{width: "100%"}}>Ok, got it!</Button>
            </div>
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
