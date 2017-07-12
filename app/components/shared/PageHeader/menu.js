import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Menu extends React.PureComponent {
  static displayName = 'PageHeader.Menu';
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    const { className, children } = this.props;

    return (
      <div className={classNames('flex items-center', className)}>
        {children}
      </div>
    );
  }
}