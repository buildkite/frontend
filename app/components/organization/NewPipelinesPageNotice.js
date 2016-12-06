import React from 'react';
import Relay from 'react-relay';

import Emojify from '../shared/Emojify';

import NoticeDismissMutation from '../../mutations/NoticeDismiss';
import FlashesStore from '../../stores/FlashesStore';

class NewPipelinesPageNotice extends React.Component {
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
        <div style={{ backgroundColor: "#f0fdc1", marginTop: -10 }} className="mb4">
          <div className="container flex items-center">
            <div className="flex-auto mr4 py1" style={{ color: "#254329" }}>
              Welcome to the new pipelines page <Emojify text=":sparkles:"/>
              {' '}
              Read the <a href="https://building.buildkite.com/new-in-buildkite-pipeline-metrics-b5e7bf187272" className="lime text-decoration-none hover-underline semi-bold">announcement</a> to find out all about it!
            </div>
            <button className="btn px4 mxn4 py4 lime text-decoration-none hover-underline" onClick={this.handleDismissClick}>Dismiss</button>
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

export default Relay.createContainer(NewPipelinesPageNotice, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        notice(namespace: NOTICE_NAMESPACE_FEATURE, scope: "pipelines-page-1-0") {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
