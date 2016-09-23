import React from 'react'
import Relay from 'react-relay';

import PusherStore from '../../../stores/PusherStore'
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import Build from './build'

class BuildsDropdownIndex extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent)

    this.props.relay.setVariables({ isMounted: true });
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent)
  }

  render() {
    if (this.props.viewer.builds) {
      if (this.props.viewer.builds.edges.length > 0) {
        return this.renderBuilds();
      } else {
        return this.renderSetupInstructions();
      }
    } else {
      return this.renderSpinner();
    }
  }

  renderBuilds() {
    return (
      <div>
        <div className="px3 py2">
          {this.props.viewer.builds.edges.map((edge) => <Build key={edge.node.id} build={edge.node} />)}
        </div>
        <div className="pb2 px3">
          <Button href="/builds" theme="default" outline={true} className="center" style={{width: "100%"}}>More Builds</Button>
        </div>
      </div>
    )
  }

  renderSetupInstructions() {
    return (
      <div className="px3 py2">
        <div className="mb3">It looks like you haven’t created any builds yet. If you have created builds check that you’ve added all your git commit email addresses in your personal settings.</div>
        <Button href="/user/emails" theme="default" outline={true} className="center" style={{width: "100%"}}>Update Email Settings</Button>
      </div>
    )
  }

  renderSpinner() {
    return (
      <div className="px3 py2 center">
        <Spinner/>
      </div>
    )
  }

  handlePusherWebsocketEvent(payload) {
    this.props.relay.forceFetch()
  }
}

export default Relay.createContainer(BuildsDropdownIndex, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        builds(first: 5) @include(if: $isMounted) {
          edges {
            node {
              id
              ${Build.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
