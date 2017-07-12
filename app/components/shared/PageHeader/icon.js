import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

const DivWithSlightRightMargin = styled('div').attrs({
  className: 'align-middle'
})`
  /* Slightly less than the mr3 (15px) */
  margin-right: 13px;
`;

export default class Icon extends React.PureComponent {
  static displayName = 'PageHeader.Icon';
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    const { className, children } = this.props;

    return (
      <DivWithSlightRightMargin className={classNames('flex items-center align-middle', className)}>
        {children}
      </DivWithSlightRightMargin>
    );
  }
}