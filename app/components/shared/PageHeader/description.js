import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Description extends React.PureComponent {
  static displayName = 'PageHeader.Description';
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    const { className, children } = this.props;

    return (
      <div className={classNames('dark-gray mt1 max-width-2', className)}>
        {children}
      </div>
    );
  }
}
