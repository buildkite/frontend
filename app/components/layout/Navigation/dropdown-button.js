import React from 'react';
import classNames from 'classnames';

class DropdownButton extends React.Component {
  static displayName = "Navigation.DropdownButton";

  static propTypes = {
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node
  };

  render() {
    return (
      <button style={this.props.style} className={classNames("btn black hover-lime focus-lime flex items-center flex-none semi-bold", this.props.className)}>
        {this.props.children}
      </button>
    );
  }
}

export default DropdownButton;
