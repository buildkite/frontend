import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class FormInputLabel extends React.PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    children: PropTypes.node,
    errors: PropTypes.bool,
    required: PropTypes.bool
  };

  render() {
    return (
      <label>
        <div className={classNames("bold mb1", { "red": (this.props.errors && this.props.errors.length) })}>
          {this.props.label}
          {this.props.required && <span className="dark-gray h6"> — Required</span>}
        </div>
        {this.props.children}
      </label>
    );
  }
}

export default FormInputLabel;
