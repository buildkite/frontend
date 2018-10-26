// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

type Props = {
  children: React.Node,
  title?: string,
  className?: string,
  outline?: boolean
};

export default class Badge extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    outline: PropTypes.bool
  };

  render() {
    const { children, className, title } = this.props;

    const badgeClassName = classNames(
      "inline-block rounded ml1 small p1 line-height-1 tabular-numerals",
      (this.props.outline ? 'border border-gray dark-gray' : 'bg-black white'),
      className
    );

    return (
      <span className={badgeClassName} title={title}>{children}</span>
    );
  }
}
