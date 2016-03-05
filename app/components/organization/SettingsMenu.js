import { PropTypes } from 'react';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';
import Permissions from '../shared/Permissions';

const SettingsMenu = (props) =>
  <Permissions permissions={props.organization.permissions}>
    <Menu>
      <Menu.Header>{props.organization.name}</Menu.Header>

      <Permissions.Only allowed="organizationUpdate">
        <Menu.Button href={`/organizations/${props.organization.slug}/settings`}>
          <Icon icon="settings" className="icon-mr"/>Settings
        </Menu.Button>
      </Permissions.Only>

      <Permissions.Only allowed="organizationMemberCreate">
        <Menu.Button href={`/organizations/${props.organization.slug}/users`} badge={props.organization.members.count + props.organization.invitations.count}>
          <Icon icon="users"className="icon-mr"/>Users
        </Menu.Button>
      </Permissions.Only>

      <Permissions.Only allowed="notificationServiceUpdate">
        <Menu.Button href={`/organizations/${props.organization.slug}/services`}>
          <Icon icon="notification-services" className="icon-mr"/>Notification Services
        </Menu.Button>
      </Permissions.Only>

      <Permissions.Only allowed="organizationBillingUpdate">
        <Menu.Button href={`/organizations/${props.organization.slug}/billing`}>
          <Icon icon="billing" className="icon-mr"/>Billing
        </Menu.Button>
      </Permissions.Only>
    </Menu>

    <Menu>
      <Menu.Button href={`/user/settings`}>Personal Settings</Menu.Button>
    </Menu>
  </Permissions>

SettingsMenu.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    members: PropTypes.shape({
      count: PropTypes.number.isRequired
    }).isRequired,
    invitations: PropTypes.shape({
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

export default SettingsMenu;
