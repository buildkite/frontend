import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

class FormInputLabel extends React.Component {
  static propTypes = {
    label: React.PropTypes.node.isRequired,
    children: React.PropTypes.node,
    errors: React.PropTypes.bool
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

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
