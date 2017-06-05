import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Badge extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { children, className } = this.props;

    const badgeClassName = classNames(
      "inline-block bg-black white rounded ml1 small p1 line-height-1 tabular-numerals",
      className
    );

    return (
      <span className={badgeClassName}>{children}</span>
    );
  }
}
