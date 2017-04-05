import React from 'react';
import classNames from 'classnames';

class FormInputLabel extends React.PureComponent {
  static propTypes = {
    label: React.PropTypes.node.isRequired,
    children: React.PropTypes.node,
    errors: React.PropTypes.bool
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
