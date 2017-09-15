// @flow

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

type Props = {
  children: React$Node,
  className?: string
};

export default class Header extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    return (
      <h2 className={classNames('h4 m0 bg-silver py2 px3 semi-bold line-height-4', this.props.className)}>
        {this.props.children}
      </h2>
    );
  }
}
