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
      })
    })
  };

  render() {
    let memberCount = this.props.organization.members.count + this.props.organization.invitations.count;

    return (
      <div>
        <Menu>
          <span>{this.props.organization.name}</span>
          <MenuButton href={`/organizations/${this.props.organization.slug}/settings`}>
            <SettingsIcon className="mr1"/>Settings
          </MenuButton>
          <MenuButton href={`/organizations/${this.props.organization.slug}/members`} badge={memberCount}>
            <MembersIcon className="mr1"/>Members
          </MenuButton>
          <MenuButton href={`/organizations/${this.props.organization.slug}/services`}>
            <ServicesIcon className="mr1"/>Services
          </MenuButton>
          <MenuButton href={`/organizations/${this.props.organization.slug}/billing`}>
            <BillingIcon className="mr1"/>Billing
          </MenuButton>
	</Menu>

        <a href="/user/settings" className="btn block border rounded py2 hover-lime focus-lime">Personal Settings</a>
      </div>
    );
  }
}

export default SettingsMenu;
