import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class FormInputLabel extends React.PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    children: PropTypes.node,
    errors: PropTypes.bool
  };

  render() {
    return (
      <label>
        <div className={classNames("bold mb1", { "red": this.props.errors })}>
          {this.props.label}
        </div>
        {this.props.children}
      </label>
    );
  }
}

export default FormInputLabel;
