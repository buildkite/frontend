// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

type Props = {
  children: React.Node,
  title?: string,
  className?: string,
  outline?: boolean,
  caps?: boolean,
  bold?: boolean
};

export default class Badge extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    outline: PropTypes.bool,
    bold: PropTypes.bool
  };

  render() {
    const { children, className, title } = this.props;

    const badgeClassName = classNames(
      "inline-block rounded ml1 small line-height-1 tabular-numerals",
      (this.props.outline ? 'border border-gray very-dark-gray' : 'bg-black white'),
      (this.props.caps && 'caps'),
      (this.props.bold && 'semi-bold'),
      className
    );

    return (
      <span className={badgeClassName} title={title} style={{ padding: '4px 5px' }}>{children}</span>
    );
  }
}
