import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatNumber } from '../../../lib/number';

const TabButton = styled.a.attrs({
  className: 'px3 pt2 pb1 border-bottom border-lime block text-decoration-none black'
})`
  border-bottom-width: 4px;
  ${(props) => props.selected ? '' : 'border-color: transparent;'}
`;

class Tab extends React.PureComponent {
  static propTypes = {
    badge: PropTypes.number,
    children: PropTypes.node.isRequired
  };

  render() {
    const affix = this.props.badge
      ? <span className="dark-gray"> {formatNumber(this.props.badge)}</span>
      : null;

    return (
      <li>
        <TabButton
          href="#"
          {...this.props}
        >
          <span className="semi-bold">{this.props.children}</span>{affix}
        </TabButton>
      </li>
    );
  }
}

export default Tab;
