import React from 'react';

import Dropdown from '../../shared/Dropdown';
import JobStatesConstants from '../../../constants/JobStates';

const STATES = {
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

  [JobStatesConstants.CANCELING]: {
    label: "Canceling"
  },

  [JobStatesConstants.TIMING_OUT]: {
    label: "Timing Out"
  }
};

class StateSelector extends React.Component {
  static propTypes = {
    selection: React.PropTypes.string,
    onSelect: React.PropTypes.func
  };

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
        <div key={state} className="btn block hover-bg-silver" onClick={() => this.setState(state)}>
          <span className="block">{STATES[state].label}</span>
        </div>
      );
    });
  }

  setState(state) {
    this.dropdownNode.setShowing(false);

    this.props.onSelect(state);
  }
}

export default StateSelector;
