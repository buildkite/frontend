import React from 'react';
import Relay from 'react-relay';

import Emojify from '../../shared/Emojify';
import Duration from '../../shared/Duration';

import PusherStore from '../../../stores/PusherStore';
import BuildState from '../../icons/BuildState';

import { buildStatus } from '../../../lib/builds';
import { shortMessage } from '../../../lib/commits';
import { getDateString } from '../../../lib/date';

class BuildsDropdownBuild extends React.Component {
  static propTypes = {
    build: React.PropTypes.object,
    relay: React.PropTypes.object.isRequired
  }

  state = {
    hover: false
  }

  componentDidMount() {
    PusherStore.on("websocket:event", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handlePusherWebsocketEvent);
  }

  render() {
    const messageClassName = `semi-bold ${this.state.hover ? 'lime' : 'black'}`;
    const buildTime = buildStatus(this.props.build).timeValue;

    return (
      <div>
        <a href={this.props.build.url} className="flex text-decoration-none dark-gray hover-lime mb2" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
          <div className="pr2 center">
            <BuildState.Small className="block" state={this.props.build.state} />
          </div>
          <div className="flex-auto">
            <span className="block line-height-3 overflow-hidden overflow-ellipsis">
              <Emojify className={messageClassName} text={shortMessage(this.props.build.message)} /> in <span className={messageClassName}>{this.props.build.pipeline.name}</span>
            </span>
            <span className="block" title={getDateString(buildTime)}><Duration.Full from={buildTime} overrides={{ length: 1 }} tabularNumerals={false} /> ago</span>
          </div>
        </a>
      </div>
    );
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }

  handlePusherWebsocketEvent = (payload) => {
    if (payload.event === "build:updated" && payload.graphql.id === this.props.build.id) {
      this.props.relay.forceFetch();
    }
  };
}

export default Relay.createContainer(BuildsDropdownBuild, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        id
        message
        state
        createdAt
        canceledAt
        finishedAt
        url
        commit
        pipeline {
          name
        }
      }
    `
  }
});
