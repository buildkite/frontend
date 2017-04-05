import React from 'react';
import Relay from 'react-relay';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';
import permissions from '../../lib/permissions';

class SettingsMenu extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      members: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      invitations: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      teams: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      permissions: React.PropTypes.shape({
        organizationUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        organizationInvitationCreate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        teamAdmin: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        notificationServiceUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        organizationBillingUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }),
    relay: React.PropTypes.object.isRequired
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
