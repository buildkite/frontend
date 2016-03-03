import React from 'react';
import * as Menu from '../shared/Menu';

import SettingsIcon from "../icons/Settings";
import EmailsIcon from "../icons/Emails";
import ConnectedAccountsIcon from "../icons/ConnectedAccounts";
import APITokensIcon from "../icons/APITokens";

class SettingsMenu extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      organizations: React.PropTypes.shape({
        edges: React.PropTypes.array
      })
    })
  };

  render() {
    return (
      <div>
        <Menu.List>
          <span>Personal Settings</span>
          <Menu.Button href={`/user/settings`}>
            <SettingsIcon className="mr1"/>Settings
          </Menu.Button>
          <Menu.Button href={`/user/emails`}>
            <EmailsIcon className="mr1"/>Emails
          </Menu.Button>
          <Menu.Button href={`/user/connected-accounts`}>
            <ConnectedAccountsIcon className="mr1"/>Connected Accounts
          </Menu.Button>
          <Menu.Button href={`/user/api-access-tokens`}>
            <APITokensIcon className="mr1"/>API Access Tokens
          </Menu.Button>
        </Menu.List>

        {this._organizationSettingsMenu()}
      </div>
    );
  }

  _organizationSettingsMenu() {
    let organizations = []

    this.props.viewer.organizations.edges.forEach((organization) => {
      if(organization.node.permissions.organizationUpdate.allowed) {
        organizations.push(
          <Menu.Button key={organization.node.slug} href={`/organizations/${organization.node.slug}/settings`}>{organization.node.name}</Menu.Button>
        )
      }
    });

    if(organizations.length > 0) {
      return (
        <Menu.List>
          <span>Organization Settings</span>
          {organizations}
        </Menu.List>
      )
    }
  }
}

export default SettingsMenu;
