import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import Emojify from '../../../shared/Emojify';
import Duration from '../../../shared/Duration';

import PusherStore from '../../../../stores/PusherStore';
import BuildState from '../../../icons/BuildState';

import { buildStatus } from '../../../../lib/builds';
import { shortMessage } from '../../../../lib/commits';
import { getDateString } from '../../../../lib/date';

const BuildLink = styled.a.attrs({
  className: 'flex text-decoration-none dark-gray hover-lime mb2'
})`
  &:hover .build-link-message {
    color: inherit;
  }
`;

class BuildsDropdownBuild extends React.PureComponent {
  static propTypes = {
    build: PropTypes.object,
    relay: PropTypes.object.isRequired
  }

  componentDidMount() {
    PusherStore.on("websocket:event", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handlePusherWebsocketEvent);
  }

  handlePusherWebsocketEvent = (payload) => {
    if (payload.event === "build:updated" && payload.graphql.id === this.props.build.id) {
      this.props.relay.forceFetch();
    }
  };

  render() {
    const buildTime = buildStatus(this.props.build).timeValue;
    const buildTimeAbsolute = getDateString(buildTime);

    return (
      <BuildLink href={this.props.build.url}>
        <div className="pr2 center">
          <BuildState.Small
            className="block"
            state={this.props.build.state}
          />
        </div>
        <div className="flex-auto">
          <span className="block line-height-3 overflow-hidden overflow-ellipsis">
            <Emojify
              className="build-link-message semi-bold black"
              text={shortMessage(this.props.build.message)}
            />
            {' in '}
            <Emojify
              className="build-link-message semi-bold black"
              text={shortMessage(this.props.build.pipeline.name)}
            />
          </span>
          <span className="block" title={buildTimeAbsolute}>
            <Duration.Full from={buildTime} overrides={{ length: 1 }} tabularNumerals={false} /> ago
          </span>
        </div>
      </BuildLink>
    );
  }
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
