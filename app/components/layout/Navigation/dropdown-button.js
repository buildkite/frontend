import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class DropdownButton extends React.PureComponent {
  static displayName = "Navigation.DropdownButton";

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    onMouseEnter: PropTypes.func
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
