import React from 'react';
import Relay from 'react-relay';

import BuildStateSwitcher from '../build/StateSwitcher';

import PusherStore from '../../stores/PusherStore';

class BuildsNavigation extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired,
    buildState: React.PropTypes.string
  };

  componentDidMount() {
    PusherStore.on("websocket:event", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handlePusherWebsocketEvent);
  }

  render() {
    return (
      <BuildStateSwitcher
        runningBuildsCount={this.props.pipeline.runningBuilds.count}
        scheduledBuildsCount={this.props.pipeline.scheduledBuilds.count}
        state={this.props.buildState}
        path={`/${this.props.pipeline.organization.slug}/${this.props.pipeline.slug}/builds`}
      />
    );
  }

  handlePusherWebsocketEvent = (payload) => {
    if (payload.event === "project:updated" && payload.graphql.id === this.props.pipeline.id) {
      this.props.relay.forceFetch();
    }
  };
}

export default Relay.createContainer(BuildsNavigation, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        slug
        organization {
          slug
        }
        scheduledBuilds: builds(state: SCHEDULED) {
          count
        }
        runningBuilds: builds(state: RUNNING) {
          count
        }
      }
    `
  }
});
