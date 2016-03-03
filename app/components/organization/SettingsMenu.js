import React from 'react';
import { Menu, MenuButton } from '../shared/Menu';

import { IndexLink, Link } from 'react-router';
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
      <span>{this.props.organization.name}</span>
    ];

    if(this.props.organization.permissions.organizationUpdate.allowed) {
      items.push(
        <MenuButton href={`/organizations/${this.props.organization.slug}/settings`}>
          <SettingsIcon className="mr1"/>Settings
        </MenuButton>
      );
    }

    if(this.props.organization.permissions.organizationMemberCreate.allowed) {
      let membersCount = this.props.organization.members.count + this.props.organization.invitations.count;

      items.push(
        <MenuButton href={`/organizations/${this.props.organization.slug}/members`} badge={membersCount}>
          <MembersIcon className="mr1"/>Members
        </MenuButton>
      );
    }

    if(this.props.organization.permissions.notificationServiceUpdate.allowed) {
      items.push(
        <MenuButton href={`/organizations/${this.props.organization.slug}/services`}>
          <ServicesIcon className="mr1"/>Services
        </MenuButton>
      );
    }

    if(this.props.organization.permissions.organizationBillingUpdate.allowed) {
      items.push(
        <MenuButton href={`/organizations/${this.props.organization.slug}/billing`}>
          <BillingIcon className="mr1"/>Billing
        </MenuButton>
      );
    }

    return (
      <div>
        <Menu children={items} />

        <a href="/user/settings" className="btn block border rounded py2 hover-lime focus-lime">Personal Settings</a>
      </div>
    );
  }
}

export default SettingsMenu;
