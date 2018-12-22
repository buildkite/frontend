// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import styled from 'styled-components';
import UserAvatar from 'app/components/shared/UserAvatar';
import BreakpointContainer from 'app/components/BreakpointContainer';
import type { UserNavigation_organization } from './__generated__/UserNavigation_organization.graphql';
import type { UserNavigation_viewer } from './__generated__/UserNavigation_viewer.graphql';

// TODO:
// ----------------------------------------------------------------------------
import NavigationButton from 'app/components/layout/Navigation/navigation-button';
import MyBuilds from 'app/components/layout/Navigation/MyBuilds';
// ----------------------------------------------------------------------------

const UserNavigationWrapper = styled.header`
  padding: 20px;
  background: ${(props) => props.warning ? (
    `repeating-linear-gradient(-55deg, #FFF1D9, #FFF1D9 10px, #FFFFEB 10px, #FFFFEB 20px)`
  ) : (
    `#EEEEEF`
  )}
`;

type Props = {
  organization: UserNavigation_organization,
  viewer: UserNavigation_viewer,
  warning: boolean,
};

function UserNavigation(props: Props) {
  return (
    <UserNavigationWrapper warning={props.warning}>
      <BreakpointContainer>
        <NavigationButton href="/docs">
          Documentation
        </NavigationButton>
        <NavigationButton onClick={() => alert('TODO')}>
          Support
        </NavigationButton>
        <MyBuilds viewer={props.viewer} />
        <span className="flex items-center xs-hide sm-flex ml1 flex-auto">
          <span className="truncate" data-current-user-name={true}>
            {props.viewer.user.name}
          </span>
        </span>
        <UserAvatar user={props.viewer.user} />
      </BreakpointContainer>
    </UserNavigationWrapper>
  );
}


export default createFragmentContainer(UserNavigation, graphql`
  fragment UserNavigation_viewer on Viewer {
    user {
      name
      avatar {
        url
      }
    }
  }

  fragment UserNavigation_organization on Organization {
    id
    name
    slug
  }
`);