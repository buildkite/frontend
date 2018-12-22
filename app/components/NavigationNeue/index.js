// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import UserNavigation from './UserNavigation';
import OrganizationNavigation from './OrganizationNavigation';
import type { NavigationNeue_viewer } from './__generated__/NavigationNeue_viewer.graphql';
import type { NavigationNeue_organization } from './__generated__/NavigationNeue_organization.graphql';

type State = {};

type Props = {
  viewer: NavigationNeue_viewer,
  organization: NavigationNeue_organization,
  warning: boolean
};

class NavigationNeue extends React.PureComponent<Props, State> {
  static defaultProps = {
    warning: window._navigation && window._navigation.warning
  }

  render() {
    return (
      <>
        <UserNavigation
          warning={this.props.warning}
          viewer={this.props.viewer}
          organization={this.props.organization}
        />
        <OrganizationNavigation
          viewer={this.props.viewer}
          organization={this.props.organization}
        />
      </>
    );
  }
}

export default createFragmentContainer(NavigationNeue, graphql`
  fragment NavigationNeue_viewer on Viewer {
    ...UserNavigation_viewer
    ...OrganizationNavigation_viewer
  }
  fragment NavigationNeue_organization on Organization {
    ...UserNavigation_organization
    ...OrganizationNavigation_organization
  }
`);