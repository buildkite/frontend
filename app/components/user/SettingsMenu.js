import React from 'react';
import Menu from '../shared/Menu';

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
        <Menu>
          <Menu.Header>Personal Settings</Menu.Header>

          <Menu.Button href={`/user/settings`}>
            <SettingsIcon className="icon-mr"/>Profile &amp; Password
          </Menu.Button>

          <Menu.Button href={`/user/emails`}>
            <EmailsIcon className="icon-mr"/>Email Settings
          </Menu.Button>

          <Menu.Button href={`/user/connected-accounts`}>
            <ConnectedAccountsIcon className="icon-mr"/>Connected Services
          </Menu.Button>

          <Menu.Button href={`/user/api-access-tokens`}>
            <APITokensIcon className="icon-mr"/>API Access Tokens
          </Menu.Button>
        </Menu>

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
        <Menu>
          <Menu.Header>Organization Settings</Menu.Header>
          {organizations}
        </Menu>
      )
    }
  }
}

export default SettingsMenu;
