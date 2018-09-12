// @flow

import * as React from 'react';
import Relay from 'react-relay/classic';
import classNames from 'classnames';
import styled from 'styled-components';

import UserAvatar from '../../shared/UserAvatar';
import Dropdown from '../../shared/Dropdown';
import Badge from '../../shared/Badge';
import Icon from '../../shared/Icon';
import SectionLoader from '../../shared/SectionLoader';
import AgentsCount from '../../organization/AgentsCount';
import NewChangelogsBadge from '../../user/NewChangelogsBadge';
import permissions from '../../../lib/permissions';

import UserSessionStore from '../../../stores/UserSessionStore';

import NavigationButton from './navigation-button';
import DropdownButton from './dropdown-button';
import SupportDialog from './support-dialog';
import MyBuilds from './MyBuilds';

const ArrowDropdownButton = styled(DropdownButton)`
  background-repeat: no-repeat;
  background-position: center right;

  @media (min-width: 1200px) {
    background-image: url(${require('./nav-button-right-arrow.svg')});
    padding-right: 20px;
  }
`;

type Props = {
  viewer?: Object,
  organization?: {
    id: string,
    slug: string,
    name: string,
    permissions: Object
  },
  relay: Object
};

type State = {
  showingOrgDropdown: boolean,
  showingUserDropdown: boolean,
  showingSupportDialog: boolean,
  warning: boolean,
  lastDefaultTeam: ?string
};

class Navigation extends React.PureComponent<Props, State> {
  logoutFormNode: ?HTMLFormElement;
  userDropdown: ?Dropdown;

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
    UserSessionStore.on('change', this.handleSessionDataChange);
  }

  componentWillMount() {
    // When the page loads, we want to pull the last default team out of the UserSessionStore.
    if (this.props.organization && this.props.organization.id) {
      this.setState({
        lastDefaultTeam: UserSessionStore.get(`organization-default-team:${this.props.organization.id}`)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // If we're moving between organizations, we need to pull out the new
    // organization's default team setting, if it's available.
    if (
      nextProps.organization && nextProps.organization.id &&
      (!this.props.organization || nextProps.organization.id !== this.props.organization.id)
    ) {
      this.setState({
        lastDefaultTeam: UserSessionStore.get(`organization-default-team:${nextProps.organization.id}`)
      });
    }
  }

  componentWillUnmount() {
    UserSessionStore.off('change', this.handleSessionDataChange);
  }

  state = {
    showingOrgDropdown: false,
    showingUserDropdown: false,
    showingSupportDialog: false,
    warning: window['_navigation'] && window['_navigation']['warning'],
    lastDefaultTeam: null
  };

  handleSessionDataChange = ({ key, newValue }) => {
    if (!this.props.organization) {
      return;
    }

    // When the UserSessionStore gets a change, if the update was to the
    // currently displayed team, update the state with the new value!
    if (key === `organization-default-team:${this.props.organization.id}`) {
      this.setState({
        lastDefaultTeam: newValue
      });
    }
  };

  handleOrgDropdownToggle = (visible) => {
    this.setState({ showingOrgDropdown: visible });
  };

  handleUserDropdownToggle = (visible) => {
    this.setState({ showingUserDropdown: visible });
  };

  handleLogoutClick = (evt) => {
    evt.preventDefault();
    if (this.logoutFormNode) {
      this.logoutFormNode.submit();
    }
  };

  handleSupportClick = () => {
    // close the support dropdown if it's open
    if (this.userDropdown && this.state.showingUserDropdown) {
      this.userDropdown.setShowing(false);
    }

    this.setState({ showingSupportDialog: true });
  };

  handleSupportDialogClose = () => {
    this.setState({ showingSupportDialog: false });
  };

  handleGraphQLExplorerClick = () => {
    // Clicking the "GraphQL Explorer" link from a `frontend` page (not an
    // old-school Rails rendered page) just changes what we render in the
    // viewport of the page. This means by default, the user dropdown doesn't
    // dissapear, but the page changes. This is a hack to hide it when you
    // click on the link.
    if (this.userDropdown) {
      this.userDropdown.setShowing(false);
    }
    this.setState({ showingUserDropdown: false });
  };

  renderTopOrganizationMenu() {
    if (this.props.organization) {
      return (
        <span className="flex xs-hide sm-hide md-hide">
          {this.renderOrganizationMenu()}
        </span>
      );
    }
  }

  renderBottomOrganizationMenu() {
    if (this.props.organization) {
      return (
        <div className="border-top border-gray lg-hide">
          <div className="container flex flex-stretch" style={{ height: 45, overflowX: 'auto' }}>
            {this.renderOrganizationMenu({ paddingLeft: 0 })}
          </div>
        </div>
      );
    }
  }

  renderOrganizationsList() {
    if (!this.props.viewer || !this.props.viewer.organizations) {
      return <SectionLoader />;
    }

    const nodes = [];

    this.props.viewer.organizations.edges.forEach((org) => {
      // Don't show the active organization in the selector
      if (!this.props.organization || (org.node.slug !== this.props.organization.slug)) {
        // If the org needs SSO, show a badge
        let ssoRequiredBadge;
        if (!org.node.permissions.pipelineView.allowed && org.node.permissions.pipelineView.code === "sso_authorization_required") {
          ssoRequiredBadge = (
            <Badge outline={true} className="regular">SSO</Badge>
          );
        }

        nodes.push(
          <NavigationButton
            key={org.node.slug}
            href={`/${org.node.slug}`}
            className="block"
          >
            {org.node.name}{ssoRequiredBadge}
          </NavigationButton>
        );
      }
    });

    nodes.push(
      <NavigationButton
        key="newOrganization"
        href="/organizations/new"
        className="block"
      >
        <Icon icon="plus-circle" className="icon-mr" style={{ width: 12, height: 12 }} />Create New Organization
      </NavigationButton>
    );

    if (nodes.length > 0) {
      return nodes;
    }
  }

  getOrganizationPipelinesUrl(organization) {
    let link = `/${organization.slug}`;

    // Make the link default to the user's default team, if that data exists
    if (this.state.lastDefaultTeam) {
      link = `${link}?team=${this.state.lastDefaultTeam}`;
    }

    return link;
  }

  renderOrganizationMenu(options: { paddingLeft?: number | string, className?: string } = {}) {
    const organization = this.props.organization;
    const paddingLeft = typeof options.paddingLeft === "number" ? options.paddingLeft : 15;

    if (organization) {
      return (
        <div className={classNames("flex", options.className)}>
          {this.renderOrganizationButtons(paddingLeft)}
        </div>
      );
    }
  }

  renderOrganizationButtons(paddingLeft) {
    const organization = this.props.organization;

    // This is already checked in `renderOrganizationMenu`, but we check here
    // again to make flow play nice.
    if (!organization) {
      return;
    }

    return permissions(organization.permissions).collect(
      {
        allowed: "pipelineView",
        render: () => {
          return (
            <NavigationButton key={1} className="py0" style={{ paddingLeft: paddingLeft }} href={this.getOrganizationPipelinesUrl(organization)} linkIf={true}>Pipelines</NavigationButton>
          );
        }
      },
      {
        allowed: "agentView",
        render: () => {
          return (
            <NavigationButton key={2} className="py0" href={`/organizations/${organization.slug}/agents`} linkIf={true}>
              {'Agents'}
              <Badge className="hover-lime-child"><AgentsCount organization={organization} /></Badge>
            </NavigationButton>
          );
        }
      },
      // The settings page will redirect to the first section the user has access
      // to. If they _just_ have teams view enabled, skip the redirect and go
      // straight to the teams page.
      {
        all: {
          organizationUpdate: false,
          organizationInvitationCreate: false,
          notificationServiceUpdate: false,
          organizationBillingUpdate: false,
          teamView: true
        },
        render: () => {
          return (
            <NavigationButton key={3} className="py0" href={`/organizations/${organization.slug}/teams`}>Teams</NavigationButton>
          );
        }
      },
      {
        // If any of these permissions are allowed, render the buttons
        any: [
          "organizationUpdate",
          "organizationInvitationCreate",
          "notificationServiceUpdate",
          "organizationBillingUpdate"
        ],
        render: () => {
          return [
            <NavigationButton key={4} className="py0" href={`/organizations/${organization.slug}/users`} linkIf={true}>Users</NavigationButton>,
            <NavigationButton key={5} className="py0" href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
          ];
        }
      }
    );
  }

  renderUserMenuLabel() {
    if (!this.props.viewer) {
      return (
        <span className="flex items-center xs-hide sm-flex flex-auto">
          Unknown User
        </span>
      );
    }

    return (
      <React.Fragment>
        <UserAvatar
          user={this.props.viewer.user}
          className="flex-none flex items-center"
          style={{ width: 26, height: 26 }}
        />
        <span className="flex items-center xs-hide sm-flex ml1 flex-auto">
          <span className="truncate" data-current-user-name={true}>
            {this.props.viewer.user.name}
          </span>
        </span>
      </React.Fragment>
    );
  }

  renderGraphQLExplorerLink() {
    if (!window.Features.GraphQLExplorer) {
      return null;
    }

    return (
      <NavigationButton href="/user/graphql/console" linkIf={true} onClick={this.handleGraphQLExplorerClick}>GraphQL Explorer <span className="ml1 orange small">Beta</span></NavigationButton>
    );
  }

  render() {
    return (
      <div
        className={classNames("border-bottom border-gray bg-silver", { "bg-warning-stripes": this.state.warning })}
        style={{ fontSize: 13, marginBottom: 25 }}
        data-tag={true}
      >
        <div className="container">
          <div className="flex" style={{ height: 45 }}>
            <span className="flex relative border-right border-gray items-center">
              <NavigationButton
                href="/"
                className="px3 hover-faded-children"
                style={{
                  paddingLeft: 0,
                  // sorry, I need 1 less than px3 to make the logo not flicker
                  // in Chrome 64.0.3282.140
                  paddingRight: 14
                }}
              >
                <img
                  src={require('./logo.svg')}
                  alt="Buildkite"
                  style={{
                    width: 28,
                    height: 18,
                    marginTop: 7.5,
                    marginBottom: 4.5,
                    paddingRight: 1
                  }}
                />
              </NavigationButton>
              <NewChangelogsBadge
                className="mr2 relative"
                style={{
                  top: -5,
                  marginLeft: -8
                }}
                viewer={this.props.viewer}
                isMounted={this.props.relay.variables.isMounted}
              />
            </span>

            <Dropdown
              width={250}
              className="flex"
              style={{ flex: '0 1 auto', minWidth: 0 }}
              onToggle={this.handleOrgDropdownToggle}
            >
              <ArrowDropdownButton
                className={classNames(
                  'py0 flex-auto',
                  { lime: this.state.showingOrgDropdown }
                )}
                style={{
                  flex: '0 1 auto',
                  minWidth: 0
                }}
              >
                <span className="truncate">
                  {this.props.organization ? this.props.organization.name : 'Organizations'}
                </span>
                <Icon icon="down-triangle" className="flex-none" style={{ width: 7, height: 7, marginLeft: '.5em' }} />
              </ArrowDropdownButton>
              {this.renderOrganizationsList()}
            </Dropdown>

            {this.renderTopOrganizationMenu()}

            <MyBuilds viewer={this.props.viewer} />

            <NavigationButton
              className="py0 xs-hide sm-hide"
              href={`/docs`}
            >
              Documentation
            </NavigationButton>
            <NavigationButton
              className="py0 xs-hide sm-hide"
              onClick={this.handleSupportClick}
            >
              Support
            </NavigationButton>

            <Dropdown
              width={window.Features.GraphQLExplorer ? 180 : 170}
              className="flex"
              style={{ flex: '0 1 auto', minWidth: 55 }}
              ref={(userDropdown) => this.userDropdown = userDropdown}
              onToggle={this.handleUserDropdownToggle}
            >
              <DropdownButton
                className={classNames(
                  'py0 flex-auto',
                  { lime: this.state.showingUserDropdown }
                )}
                style={{ paddingRight: 0 }}
              >
                {this.renderUserMenuLabel()}
                <span className="flex items-center flex-none">
                  <Icon
                    icon="down-triangle"
                    style={{ width: 7, height: 7, marginLeft: '.5em' }}
                  />
                </span>
              </DropdownButton>

              <NavigationButton href="/user/settings">Personal Settings</NavigationButton>
              {this.renderGraphQLExplorerLink()}

              <div className="md-hide lg-hide">
                <NavigationButton className="md-hide lg-hide" href={`/docs`}>Documentation</NavigationButton>
                <NavigationButton className="md-hide lg-hide" onClick={this.handleSupportClick}>Support</NavigationButton>
              </div>

              <form action="/logout" method="post" ref={(logoutFormNode) => this.logoutFormNode = logoutFormNode}>
                <input type="hidden" name="_method" value={"delete"} />
                <input type="hidden" name={window._csrf.param} value={window._csrf.token} />
                <NavigationButton href="#" onClick={this.handleLogoutClick}>
                  {this.state.warning ? 'Unassume User' : 'Logout'}
                </NavigationButton>
              </form>
            </Dropdown>
          </div>

        </div>

        {this.renderBottomOrganizationMenu()}

        <SupportDialog isOpen={this.state.showingSupportDialog} onRequestClose={this.handleSupportDialogClose} />
      </div>
    );
  }
}

export default Relay.createContainer(Navigation, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
        fragment on Organization {
          ${AgentsCount.getFragment('organization')}
          name
          id
          slug
          permissions {
            pipelineView {
              allowed
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
      `,
    viewer: (variables) => Relay.QL`
        fragment on Viewer {
          ${MyBuilds.getFragment('viewer')}
          ${NewChangelogsBadge.getFragment('viewer', variables)}
          user {
            name
            avatar {
              url
            }
          }
          organizations(first: 100) @include(if: $isMounted) {
            edges {
              node {
                id
                name
                slug
                permissions {
                  pipelineView {
                    allowed
                    code
                  }
                }
              }
            }
          }
        }
      `
  }
});
