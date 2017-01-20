import React from 'react';
import classNames from 'classnames';

class DropdownButton extends React.Component {
  static displayName = "Navigation.DropdownButton";

  static propTypes = {
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    onMouseEnter: React.PropTypes.func
  };

  render() {
    return (
      <button style={this.props.style} className={classNames("btn black hover-lime focus-lime semi-bold line-height-3", this.props.className)} onMouseEnter={this.props.onMouseEnter}>
        <div className="flex items-center flex-none">
          {this.props.children}
        </div>
      </button>
    );
  }
}

export default DropdownButton;
