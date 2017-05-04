import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '../../shared/Spinner';

import Option from './option';

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
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  saving: PropTypes.bool,
  selected: PropTypes.bool
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
  saving: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired
};

export default SelectOption;
