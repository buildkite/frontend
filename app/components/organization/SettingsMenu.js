import React from 'react';
import * as Menu from '../shared/Menu';

import MembersIcon from "../icons/Members";
import SettingsIcon from "../icons/Settings";
import ServicesIcon from "../icons/Services";
import BillingIcon from "../icons/Billing";

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
      permissions: React.PropTypes.shape({
        organizationUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }),
        organizationMemberCreate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }),
        notificationServiceUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }),
        organizationBillingUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        })
      })
    })
  };

  render() {
    let items = [
      <Menu.Header key="header">{this.props.organization.name}</Menu.Header>
    ];

    if(this.props.organization.permissions.organizationUpdate.allowed) {
      items.push(
        <Menu.Button key="settings" href={`/organizations/${this.props.organization.slug}/settings`}>
          <SettingsIcon className="mr1"/>Settings
        </Menu.Button>
      );
    }

    if(this.props.organization.permissions.organizationMemberCreate.allowed) {
      let membersCount = this.props.organization.members.count + this.props.organization.invitations.count;

      items.push(
        <Menu.Button key="members" href={`/organizations/${this.props.organization.slug}/members`} badge={membersCount}>
          <MembersIcon className="mr1"/>Members
        </Menu.Button>
      );
    }

    if(this.props.organization.permissions.notificationServiceUpdate.allowed) {
      items.push(
        <Menu.Button key="services" href={`/organizations/${this.props.organization.slug}/services`}>
          <ServicesIcon className="mr1"/>Services
        </Menu.Button>
      );
    }

    if(this.props.organization.permissions.organizationBillingUpdate.allowed) {
      items.push(
        <Menu.Button key="billing" href={`/organizations/${this.props.organization.slug}/billing`}>
          <BillingIcon className="mr1"/>Billing
        </Menu.Button>
      );
    }

    return (
      <div>
        <Menu.List>
          {items}
        </Menu.List>

        <Menu.List>
          <Menu.Button href={`/user/settings`}>Personal Settings</Menu.Button>
        </Menu.List>
      </div>
    );
  }
}

export default SettingsMenu;
