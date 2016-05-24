import React from 'react';
import classNames from 'classnames';

export default class SectionLink extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    href: React.PropTypes.string,
    style: React.PropTypes.object,
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <a href={this.props.href} className={this._className()} style={this.props.style}>
        {this.props.children}
      </a>
    );
  }

  _className() {
    if (this.props.href) {
      return classNames("text-decoration-none color-inherit hover-bg-silver", this.props.className);
    } else {
      return this.props.className;
    }
  }
}
