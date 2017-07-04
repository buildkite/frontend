import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';

import cssVariables from '../../../css';

import { formatNumber } from '../../../lib/number';

const ACTIVE_CLASS_NAME = 'active';

const TabButton = styled(Link).attrs({
  className: 'px3 pt2 pb1 border-bottom block text-decoration-none black',
  activeClassName: ACTIVE_CLASS_NAME
})`
  border-bottom-width: 4px;
  border-color: transparent;

  &.${ACTIVE_CLASS_NAME} {
    border-color: ${cssVariables['--lime']};
  }
`;

class Tab extends React.PureComponent {
  static propTypes = {
    badge: PropTypes.number,
    children: PropTypes.node.isRequired
  };

  render() {
    const { badge, children, ...props } = this.props;

    const affix = badge
      ? <span className="dark-gray"> {formatNumber(badge)}</span>
      : null;

    return (
      <li>
        <TabButton {...props}>
          <span className="semi-bold">{children}</span>{affix}
        </TabButton>
      </li>
    );
  }
}

export default Tab;
