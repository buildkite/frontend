// @flow

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const BreakpointContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 768px) {
    width: 750px;
  }

  @media (min-width: 992px) {
    width: 970px;
  }

  @media (min-width: 1200px) {
    width: 1170px;
  }
`;

const UserNavigationWrapper = styled.header`
  background: #EEEEEF;
  padding: 20px;
`;

const OrganizationNavigationWrapper = styled.header`
  padding: 20px;
  margin-bottom: 40px;
`;

function UserNavigation() {
  return (
    <UserNavigationWrapper>
      <BreakpointContainer>
        UserNavigation
      </BreakpointContainer>
    </UserNavigationWrapper>
  );
}

function OrganizationNavigation() {
  return (
    <OrganizationNavigationWrapper>
      <BreakpointContainer>
        OrganizationNavigation
      </BreakpointContainer>
    </OrganizationNavigationWrapper>
  );
}

export default class NavigationNeue extends React.PureComponent<{}> {
  render() {
    return (
      <>
        <UserNavigation />
        <OrganizationNavigation />
      </>
    );
  }
}
