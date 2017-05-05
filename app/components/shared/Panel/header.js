import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Header extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    return (
      <h2 className={classNames('h4 m0 bg-silver py2 px3 semi-bold', this.props.className)}>
        {this.props.children}
      </h2>
    );
  }
}