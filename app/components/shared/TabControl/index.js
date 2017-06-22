import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tab from './Tab';

const TabList = styled.ul.attrs({
  className: 'flex m0 mb3 p0 border-bottom border-gray'
})`
  list-style: none;
  list-style-type: none;
`;

class TabControl extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.number.isRequired
  };

  render() {
    return (
      <TabList className={this.props.className}>
        {React.Children.map(this.props.children, (child, index) => (
          React.cloneElement(child, {
            selected: index === this.props.selected,
            onClick: this.handleSelect.bind(this, index)
          })
        ))}
      </TabList>
    );
  }

  handleSelect = (index, event) => {
    event.preventDefault();
    this.props.onSelect(index);
  }
}

TabControl.Tab = Tab;

export default TabControl;
