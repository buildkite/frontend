// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BuildState from 'app/components/icons/BuildState';
import { getColourForConnectionState, getLabelForConnectionState } from './shared';

import BuildStates from 'app/constants/BuildStates';

type Props = {
  agent: {
    connectionState: string,
    isRunningJob: boolean
  },
  className?: string,
  style?: Object
};

class AgentStateIcon extends React.PureComponent<Props> {
  static propTypes = {
    agent: PropTypes.shape({
      connectionState: PropTypes.string.isRequired,
      isRunningJob: PropTypes.bool.isRequired
    }).isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { agent, className } = this.props;

    const title = getLabelForConnectionState(agent.connectionState);
    const color = getColourForConnectionState(agent.connectionState, 'bg-');

    let icon;

    // If the agent is running a job, we'll steal the "running" icon
    // from the build state to show that the agent is doing something.
    if (agent.isRunningJob) {
      icon = (
        <BuildState.XSmall
          state={BuildStates.RUNNING}
          style={{ display: 'inline-block' }}
        />
      );
    } else {
      icon = (
        <div
          className={classNames('inline-block circle', color)}
          style={{ width: 13, height: 13 }}
          title={getLabelForConnectionState(agent.connectionState)}
        />
      );
    }

    return (
      <div
        title={title}
        className={classNames("inline align-middle", className)}
        style={this.props.style}
      >
        {icon}
      </div>
    );
  }
}

export default Relay.createContainer(AgentStateIcon, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        connectionState
        isRunningJob
      }
    `
  }
});
