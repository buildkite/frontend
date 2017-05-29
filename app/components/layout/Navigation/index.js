import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

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

class Navigation extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.object,
    viewer: PropTypes.object,
    relay: PropTypes.object.isRequired
  };

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
    // If we're moving between organizations, we need to pull out the new organization's default team setting,
    // if it's available.
    if (nextProps.organization && nextProps.organization.id && nextProps.organization.id !== this.props.organization.id) {
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
    this.logoutFormNode.submit();
  };

  handleSupportClick = () => {
    // close the support dropdown if it's open
    if (this.state.showingUserDropdown) {
      this.userDropdown.setShowing(false);
    }

    this.setState({ showingSupportDialog: true });
  };

  handleSupportDialogClose = () => {
    this.setState({ showingSupportDialog: false });
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

  renderMyBuilds() {
    return (
      <MyBuilds viewer={this.props.viewer} />
    );
  }

  renderOrganizationsList() {
    if (!this.props.viewer.organizations) {
      return <SectionLoader />;
    }

    const nodes = [];

    this.props.viewer.organizations.edges.forEach((org) => {
      // Don't show the active organization in the selector
      if (!this.props.organization || (org.node.slug !== this.props.organization.slug)) {
        nodes.push(
          <NavigationButton
            key={org.node.slug}
            href={`/${org.node.slug}`}
            className="block"
          >
            {org.node.name}
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

  renderOrganizationMenu(options = {}) {
    const organization = this.props.organization;
    const paddingLeft = typeof options.paddingLeft === "number" ? options.paddingLeft : 15;

    if (organization) {
      return (
        <div className={classNames("flex", options.className)}>
          <NavigationButton className="py0" style={{ paddingLeft: paddingLeft }} href={this.getOrganizationPipelinesUrl(organization)} linkIf={true}>Pipelines</NavigationButton>
          <NavigationButton className="py0" href={`/organizations/${organization.slug}/agents`} linkIf={true}>
            {'Agents'}
            <Badge className="hover-lime-child"><AgentsCount organization={organization} /></Badge>
          </NavigationButton>

          {this.renderOrganizationSettingsButton()}
        </div>
      );
    }
  }

  renderOrganizationSettingsButton() {
    const organization = this.props.organization;

    // The settings page will redirect to the first section the user has access
    // to. If they _just_ have teams admin enabled, skip the redirect and go
    // straight to the teams page.
    return permissions(organization.permissions).first(
      {
        only: "teamAdmin",
        render: () => <NavigationButton className="py0" href={`/organizations/${organization.slug}/teams`}>Settings</NavigationButton>
      },
      {
        any: true,
        render: () => {
          return [
            <NavigationButton key={1} className="py0" href={`/organizations/${organization.slug}/users`} linkIf={true}>Users</NavigationButton>,
            <NavigationButton key={2} className="py0" href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
          ];
        }
      }
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
              <NavigationButton href="/" className="px3 hover-faded-children" style={{ paddingLeft: 0 }}>
                <img
                  src={require('./logo.svg')}
                  alt="Buildkite"
                  style={{ width: 27, height: 18, marginTop: 7.5, marginBottom: 4.5 }}
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

            <Dropdown width={250} className="flex flex-shrink" style={{ flex: '0 1 auto', minWidth: 0 }} onToggle={this.handleOrgDropdownToggle}>
              <DropdownButton
                className={classNames("py0", { "lime": this.state.showingOrgDropdown })}
                style={{
                  backgroundImage: 'url(' + require('./nav-button-right-arrow.svg') + ')',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center right',
                  flex: '0 1 auto',
                  minWidth: 0,
                  paddingRight: 20
                }}
              >
                <span className="truncate">
                  {this.props.organization ? this.props.organization.name : 'Organizations'}
                </span>
                <Icon icon="down-triangle" className="flex-none" style={{ width: 7, height: 7, marginLeft: '.5em' }} />
              </DropdownButton>
              {this.renderOrganizationsList()}
            </Dropdown>

            {this.renderTopOrganizationMenu()}

            {this.renderMyBuilds()}
            <NavigationButton className="py0 xs-hide sm-hide" href={`/docs`}>Documentation</NavigationButton>
            <NavigationButton className="py0 xs-hide sm-hide" onClick={this.handleSupportClick}>Support</NavigationButton>

            <Dropdown width={170} className="flex" ref={(userDropdown) => this.userDropdown = userDropdown} onToggle={this.handleUserDropdownToggle}>
              <DropdownButton
                className={classNames("py0 flex-auto", { "lime": this.state.showingUserDropdown })}
                style={{ paddingRight: 0 }}
              >
                <UserAvatar user={this.props.viewer.user} className="flex-none flex items-center" style={{ width: 26, height: 26 }} />
                <span className="flex items-center xs-hide sm-flex ml1 flex-auto"><span className="truncate" data-current-user-name={true}>{this.props.viewer.user.name}</span></span>
                <span className="flex items-center flex-none">
                  <Icon icon="down-triangle" style={{ width: 7, height: 7, marginLeft: '.5em' }} />
                </span>
              </DropdownButton>

              <NavigationButton href="/user/settings">Personal Settings</NavigationButton>

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
            teamAdmin {
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
          organizations(first: 500) @include(if: $isMounted) {
            edges {
              node {
                slug
                name
              }
            }
          }
        }
      `
  }
});
