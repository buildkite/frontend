import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../shared/Menu';

class SettingsMenu extends React.Component {
  static propTypes = {
    viewer: PropTypes.shape({
      organizations: PropTypes.shape({
        edges: PropTypes.array
      }).isRequired
    }).isRequired
  };

  render() {
    const organizations = [];

    this.props.viewer.organizations.edges.forEach((organization) => {
      if (organization.node.permissions.organizationUpdate.allowed) {
        organizations.push(
          <Menu.Button
            key={organization.node.slug}
            href={`/organizations/${organization.node.slug}/settings`}
            label={organization.node.name}
          />
        );
      }
    });

    let organizationsMenu;
    if (organizations.length > 0) {
      organizationsMenu = (
        <Menu>
          <Menu.Header>Organization Settings</Menu.Header>
          {organizations}
        </Menu>
      );
    }

    return (
      <div>
        <Menu>
          <Menu.Header>Personal Settings</Menu.Header>

          <Menu.Button
            icon="settings"
            href="/user/settings"
            label="Profile & Password"
          />

          <Menu.Button
            icon="emails"
            href="/user/emails"
            label="Email Settings"
          />

          <Menu.Button
            icon="connected-apps"
            href="/user/connected-apps"
            label="Connected Apps"
          />

          <Menu.Button
            icon="api-tokens"
            href="/user/api-access-tokens"
            label="API Access Tokens"
          />
        </Menu>

        {organizationsMenu}
      </div>
    );
  }
}

export default SettingsMenu;
