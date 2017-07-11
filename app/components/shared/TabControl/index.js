import styled from 'styled-components';

import Tab from './Tab';

const TabControl = styled.ul.attrs({
  className: 'flex m0 mb4 p0 border-bottom border-gray'
})`
  list-style: none;
  list-style-type: none;
`;

TabControl.Tab = Tab;

export default TabControl;
