// @flow
/* eslint-disable react/display-name */

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import styled from 'styled-components';
import BreakpointContainer from 'app/components/BreakpointContainer';
import Badge from 'app/components/shared/Badge';
import AgentsCount from 'app/components/organization/AgentsCount';
import permissions from 'app/lib/permissions';
import type { OrganizationNavigation_viewer } from './__generated__/OrganizationNavigation_viewer.graphql';

// TODO:
// ----------------------------------------------------------------------------
import NavigationButton from 'app/components/layout/Navigation/navigation-button';
// ----------------------------------------------------------------------------

const OrganizationNavigationWrapper = styled.header`
  padding: 20px;
  margin-bottom: 40px;
`;

const OrganizationNavigationInner = styled.div`
  border-bottom: 1px solid #ccc;
`;

type Props = {
  viewer: OrganizationNavigation_viewer,
  organization: OrganizationNavigation_organization
};

function OrganizationNavigation(props: Props) {
  const permissionManager = permissions(props.organization.permissions);

  return (
    <OrganizationNavigationWrapper>
      <BreakpointContainer>
        <OrganizationNavigationInner>
          {props.viewer.user.name}
          <div>
            {permissionManager.collect(
              {
                allowed: "pipelineView",
                render: () => (
                  <NavigationButton key="pipelines" href="TODO" linkIf={true}>
                    Pipelines
                  </NavigationButton>
                )
              },
              {
                allowed: "pipelineView",
                and: Features.OrganizationBuildsPage,
                render: () => (
                  <NavigationButton key="builds" href="TODO">
                    Builds
                  </NavigationButton>
                )
              },
            )}
          </div>
          <div>
            {permissionManager.collect(
              {
                // If any of these permissions are allowed, render the buttons
                any: [
                  "organizationUpdate",
                  "organizationInvitationCreate",
                  "notificationServiceUpdate",
                  "organizationBillingUpdate"
                ],
                render: () => (
                  <React.Fragment key="organization">
                    <NavigationButton
                      key="users"
                      href={`/organizations/${props.organization.slug}/users`}
                      linkIf={true}
                    >
                      Users
                    </NavigationButton>
                    <NavigationButton
                      key="settings"
                      href={`/organizations/${props.organization.slug}/settings`}
                    >
                      Settings
                    </NavigationButton>
                  </React.Fragment>
                )
              },
              {
                allowed: "agentView",
                render: () => (
                  <NavigationButton key="agents" href="TODO" linkIf={true}>
                    Agents
                    <Badge className="hover-lime-child">
                      <AgentsCount organization={props.organization} />
                    </Badge>
                  </NavigationButton>
                )
              }
            )}
          </div>
        </OrganizationNavigationInner>
      </BreakpointContainer>
    </OrganizationNavigationWrapper>
  );
}

export default createFragmentContainer(OrganizationNavigation, graphql`
  fragment OrganizationNavigation_viewer on Viewer {
    user {
      name
      avatar {
        url
      }
    }
  }

  fragment OrganizationNavigation_organization on Organization {
    slug
    permissions {
      pipelineView {
        allowed
        code
      }
      agentView {
        allowed
      }
      organizationUpdate {
        allowed
      }
      organizationInvitationCreate {
        allowed
      }
      notificationServiceUpdate {
        allowed
      }
      organizationBillingUpdate {
        allowed
      }
      teamView {
        allowed
      }
    }
  }
`);
