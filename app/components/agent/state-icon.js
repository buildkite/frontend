import React from 'react';
import classNames from 'classnames';

import BuildState from '../icons/BuildState';
import { getColourForConnectionState, getLabelForConnectionState } from './shared';

export default function StateIcon(props) {
  const title = getLabelForConnectionState(props.agent.connectionState);
  const color = getColourForConnectionState(props.agent.connectionState, 'bg-');
  let icon;

  // If we've got a job, we'll steal the "running" icon from the build state
  // to show that the agent is doing something.
  if (props.agent.job) {
    icon = (
      <BuildState.XSmall state={"running"} style={{ display: 'inline-block' }} />
    );
  } else {
    icon = (
      <div
        className={classNames('inline-block circle', color)}
        style={{ width: 13, height: 13 }}
        title={getLabelForConnectionState(props.agent.connectionState)}
      />
    );
  }

  return (
    <div title={title} className={classNames("inline align-middle", props.className)}>
      {icon}
    </div>
  );
}

StateIcon.propTypes = {
  className: React.PropTypes.string,
  agent: React.PropTypes.shape({
    connectionState: React.PropTypes.string.isRequired,
    job: React.PropTypes.object
  })
};