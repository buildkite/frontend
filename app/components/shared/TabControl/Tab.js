// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';

import Badge from 'app/components/shared/Badge';

import { formatNumber } from 'app/lib/number';

const ACTIVE_CLASS_NAME = 'active';

const TabButton = styled(Link).attrs({
  className: 'px4 pt2 border-bottom block text-decoration-none black',
  activeClassName: ACTIVE_CLASS_NAME
})`
  border-bottom-width: 3px;
  border-color: transparent;
  transition: border-color 120ms;
  margin-bottom: -1px;
  height: 44px; /* Needed because the badge causes the height to increase */

  &:hover {
    border-color: #D5EBA4;
  }

  &.${ACTIVE_CLASS_NAME} {
    border-color: #14CC80;
  }
`;

type Props = {
  badge?: number,
  children: React$Node
};

class Tab extends React.PureComponent<Props> {
  static propTypes = {
    badge: PropTypes.number,
    children: PropTypes.node.isRequired
  };

  render() {
    const { badge, children, ...props } = this.props;

    const affix = badge
      ? <Badge outline={true}>{formatNumber(badge)}</Badge>
      : null;

    return (
      <li>
        <TabButton {...props}>
          <span className="semi-bold">{children}</span>
          {' '}
          {affix}
        </TabButton>
      </li>
    );
  }
}

export default Tab;
