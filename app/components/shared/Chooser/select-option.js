import React from "react";

import Spinner from '../../shared/Spinner';

import Option from "./option";

function SelectOption(props) {
  return (
    <Option value={props.value} className="btn block hover-bg-silver">
      <div className="flex items-top">
        <div className="flex-none">
          <Icon saving={props.saving} selected={props.selected} />
        </div>
        <div>
          <span className="semi-bold block">{props.label}</span>
          <small className="regular dark-gray">{props.description}</small>
        </div>
      </div>
    </Option>
  );
}

SelectOption.displayName = "Chooser.SelectOption";

SelectOption.propTypes = {
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  saving: React.PropTypes.bool,
  selected: React.PropTypes.bool
};

function Icon(props) {
  const width = 25;

  if (props.saving) {
    return (
      <div style={{ width: width }}>
        <Spinner className="fit absolute" size={16} style={{ marginTop: 3 }} color={false} />
      </div>
    );
  } else {
    const tickColor = props.selected ? "green" : "gray";

    return (
      <div className={tickColor} style={{ fontSize: 16, width: width }}>✔</div>
    );
  }
}

Icon.propTypes = {
  saving: React.PropTypes.bool.isRequired,
  selected: React.PropTypes.bool.isRequired
};

export default SelectOption;
