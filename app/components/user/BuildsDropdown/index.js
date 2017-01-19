import React from 'react';
import Relay from 'react-relay';

import PusherStore from '../../../stores/PusherStore';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import Build from './build';

class BuildsDropdown extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object,
    relay: React.PropTypes.object.isRequired
  }

  state = {
    fetching: true
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);

    this.props.relay.forceFetch({ isMounted: true }, (readyState) => {
      // Now that we've got the data, turn off the spinner
      if (readyState.done) {
        this.setState({ fetching: false });
      }
    });
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  render() {
    if (this.state.fetching) {
      return this.renderSpinner();
    } else if (this.props.viewer.user.builds.edges.length > 0) {
      return this.renderBuilds();
    } else {
      return this.renderSetupInstructions();
    }
  }

  renderBuilds() {
    return (
      <div>
        <div className="px3 py2">
          {this.props.viewer.user.builds.edges.map((edge) => <Build key={edge.node.id} build={edge.node} />)}
        </div>
        <div className="pb2 px3">
          <Button href="/builds" theme="default" outline={true} className="center" style={{ width: "100%" }}>More Builds</Button>
        </div>
      </div>
    );
  }

  renderSetupInstructions() {
    return (
      <div className="px3 py2">
        <div className="mb2">To have your builds shown here, make sure to add and verify your commit email address (e.g. <code className="border border-gray dark-gray" style={{ padding: '.1em .3em' }}>git config user.email</code>) to your list of email addresses.</div>
        <Button href="/user/emails" theme="default" outline={true} className="center" style={{ width: "100%" }}>Update Email Addresses</Button>
      </div>
    );
  }

  renderSpinner() {
    return (
      <div className="px3 py2 center">
        <Spinner />
      </div>
    );
  }

  handlePusherWebsocketEvent = (payload) => {
    // Only do a relay update of the builds count changes
    if (this._buildsCount !== payload.buildsCount) {
      this.props.relay.forceFetch();
    }

    // Save the new builds count
    this._buildsCount = payload.buildsCount;
  };
}

export default Relay.createContainer(BuildsDropdown, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          builds(first: 5) @include(if: $isMounted) {
            edges {
              node {
                id
                ${Build.getFragment('build')}
              }
            }
          }
        }
      }
    `
  }
});
