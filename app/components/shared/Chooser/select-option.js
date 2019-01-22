import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Spinner from 'app/components/shared/Spinner';
import Icon from 'app/components/shared/Icon';

import Option from './option';

function SelectOption(props) {
  return (
    <Option value={props.value} className={classNames("btn block hover-bg-silver", { "bg-silver": props.selected })}>
      <div className="flex items-top">
        <div className="flex-none">
          <SelectIcon saving={props.saving} selected={props.selected} />
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
  description: PropTypes.node.isRequired,
  saving: PropTypes.bool,
  selected: PropTypes.bool
};

function SelectIcon(props) {
  const size = 25;

  if (props.saving) {
    return (
      <div className="inline-block relative" style={{ width: size, height: size }}>
        <Spinner className="fit absolute" size={16} color={false} style={{ left: 3 }} />
      </div>
    );
  }

  const tickColor = props.selected ? "green" : "dark-gray";

  return (
    <Icon icon="permission-small-tick" className={classNames(tickColor, "relative")} style={{ width: size, height: size, top: -3, left: -2 }} />
  );
}

SelectIcon.propTypes = {
  saving: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired
};

export default SelectOption;
