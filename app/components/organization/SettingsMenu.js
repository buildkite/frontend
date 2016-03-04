import { Component, PropTypes } from 'react';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';
import Permissions from '../shared/Permissions';

class SettingsMenu extends Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired,
      invitations: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired,
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired,
      permissions: PropTypes.shape({
        organizationUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationMemberCreate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        notificationServiceUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationBillingUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamAdmin: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    })
  };

  render() {
    return (
      <Permissions permissions={this.props.organization.permissions}>
        <Menu>
          <Menu.Header>{this.props.organization.name}</Menu.Header>

          <Permissions.Only allowed="organizationUpdate">
            <Menu.Button href={`/organizations/${this.props.organization.slug}/settings`}>
              <Icon icon="settings" className="icon-mr"/>Settings
            </Menu.Button>
          </Permissions.Only>

          <Permissions.Only allowed="organizationMemberCreate">
            <Menu.Button href={`/organizations/${this.props.organization.slug}/users`} badge={this.props.organization.members.count + this.props.organization.invitations.count}>
              <Icon icon="users"className="icon-mr"/>Users
            </Menu.Button>
          </Permissions.Only>

          <Permissions.Only allowed="teamAdmin">
            <Menu.Button href={`/organizations/${this.props.organization.slug}/teams`}>
              <Icon icon="teams" className="icon-mr"/>Teams
            </Menu.Button>
          </Permissions.Only>

          <Permissions.Only allowed="notificationServiceUpdate">
            <Menu.Button href={`/organizations/${this.props.organization.slug}/services`}>
              <Icon icon="notification-services" className="icon-mr"/>Notification Services
            </Menu.Button>
          </Permissions.Only>

          <Permissions.Only allowed="organizationBillingUpdate">
            <Menu.Button href={`/organizations/${this.props.organization.slug}/billing`}>
              <Icon icon="billing" className="icon-mr"/>Billing
            </Menu.Button>
          </Permissions.Only>
        </Menu>

        <Menu>
          <Menu.Button href={`/user/settings`}>Personal Settings</Menu.Button>
        </Menu>
      </Permissions>
    );
  }
}

export default SettingsMenu;
