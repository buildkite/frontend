import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';
import permissions from '../../lib/permissions';

class SettingsMenu extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      invitations: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      permissions: PropTypes.shape({
        organizationUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationInvitationCreate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamAdmin: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        notificationServiceUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationBillingUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }),
    relay: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Header>{this.props.organization.name}</Menu.Header>
          {this.renderButtons()}
        </Menu>

        <Menu>
          <Menu.Button href={`/user/settings`}>Personal Settings</Menu.Button>
        </Menu>
      </div>
    );
  }

  renderButtons() {
    return permissions(this.props.organization.permissions).collect(
      {
        allowed: "organizationUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`/organizations/${this.props.organization.slug}/settings`}>
            <Icon icon="settings" className="icon-mr"/>Settings
          </Menu.Button>
        )
      },
      {
        always: true,
        render: (idx) => (
          <Menu.Button key={idx} link={`/organizations/${this.props.organization.slug}/users`} badge={this.calculateUsersCount()}>
            <Icon icon="users" className="icon-mr"/>Users
          </Menu.Button>
        )
      },
      {
        allowed: "teamAdmin",
        render: (idx) => (
          <Menu.Button key={idx} link={`/organizations/${this.props.organization.slug}/teams`} badge={this.props.organization.teams && this.props.organization.teams.count}>
            <Icon icon="teams" className="icon-mr"/>Teams
          </Menu.Button>
        )
      },
      {
        allowed: "notificationServiceUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`/organizations/${this.props.organization.slug}/services`}>
            <Icon icon="notification-services" className="icon-mr"/>Notification Services
          </Menu.Button>
        )
      },
      {
        allowed: "organizationUpdate",
        and: Features.SSOSettings,
        render: (idx) => (
          <Menu.Button key={idx} link={`/organizations/${this.props.organization.slug}/sso`}>
            <Icon icon="sso" className="icon-mr"/>Single Sign On
          </Menu.Button>
        )
      },
      {
        allowed: "organizationBillingUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`/organizations/${this.props.organization.slug}/billing`}>
            <Icon icon="billing" className="icon-mr"/>Billing
          </Menu.Button>
        )
      }
    );
  }

  calculateUsersCount() {
    if (this.props.organization.members) {
      return this.props.organization.members.count + this.props.organization.invitations.count;
    }
  }
}

export default Relay.createContainer(SettingsMenu, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        members @include(if: $isMounted) {
          count
        }
        invitations(state: PENDING) @include(if: $isMounted) {
          count
        }
        teams @include(if: $isMounted) {
          count
        }
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
    `
  }
});
