import React from 'react';

import Dropdown from '../../shared/Dropdown';
import JobStatesConstants from '../../../constants/JobStates';

const STATES = {
  [null]: {
    label: "All",
  },

  [JobStatesConstants.PENDING]: {
    label: "Pending"
  },

  [JobStatesConstants.WAITING]: {
    label: "Waiting"
  },

  [JobStatesConstants.WAITING_FAILED]: {
    label: "Waiting Failed"
  },

  [JobStatesConstants.BLOCKED]: {
    label: "Blocked"
  },

  [JobStatesConstants.BLOCKED_FAILED]: {
    label: "Blocked Failed"
  },

  [JobStatesConstants.UNBLOCKED]: {
    label: "Unblocked"
  },

  [JobStatesConstants.UNBLOCKED_FAILED]: {
    label: "Unblocked Failed"
  },

  [JobStatesConstants.SCHEDULED]: {
    label: "Scheduled"
  },

  [JobStatesConstants.ASSIGNED]: {
    label: "Assigned"
  },

  [JobStatesConstants.ACCEPTED]: {
    label: "Accepted"
  },

  [JobStatesConstants.RUNNING]: {
    label: "Running"
  },

  [JobStatesConstants.FINISHED]: {
    label: "Finished"
  },

  [JobStatesConstants.CANCELING]: {
    label: "Canceling"
  },

  [JobStatesConstants.CANCELED]: {
    label: "Canceled"
  },

  [JobStatesConstants.TIMING_OUT]: {
    label: "Timing Out"
  },

  [JobStatesConstants.TIMED_OUT]: {
    label: "Timed Out"
  },

  [JobStatesConstants.SKIPPED]: {
    label: "Skipped"
  }
}

class StateSelector extends React.Component {
  render() {
    return (
      <Dropdown width={270} ref={(dropdownNode) => this.dropdownNode = dropdownNode}>
        <div className="underline-dotted cursor-pointer inline-block regular dark-gray">{STATES[this.props.selection].label}</div>
        {this.renderOptions()}
      </Dropdown>
    );
  }

  renderOptions() {
    return Object.keys(STATES).map((state) => {
      return (
        <div key={state} className="btn block hover-bg-silver" onClick={() => { this.dropdownNode.setShowing(false); this.props.onSelect(state) }}>
          <span className="block">{STATES[state].label}</span>
        </div>
      )
    });
  }
}

export default StateSelector;
