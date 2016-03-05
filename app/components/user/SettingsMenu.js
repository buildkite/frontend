import React from 'react';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';

const SettingsMenu = (props) => {
  let organizations = []

  props.viewer.organizations.edges.forEach((organization) => {
    if(organization.node.permissions.organizationUpdate.allowed) {
      organizations.push(
        <Menu.Button key={organization.node.slug} href={`/organizations/${organization.node.slug}/settings`}>{organization.node.name}</Menu.Button>
      )
    }
  });

  let organizationsMenu;
  if(organizations.length > 0) {
    organizationsMenu = (
      <Menu>
        <Menu.Header>Organization Settings</Menu.Header>
        {organizations}
      </Menu>
    )
  }

  return (
    <div>
      <Menu>
        <Menu.Header>Personal Settings</Menu.Header>

        <Menu.Button href={`/user/settings`}>
          <Icon icon="settings" className="icon-mr"/>Profile &amp; Password
        </Menu.Button>

        <Menu.Button href={`/user/emails`}>
          <Icon icon="emails" className="icon-mr"/>Email Settings
        </Menu.Button>

        <Menu.Button href={`/user/connected-apps`}>
          <Icon icon="connected-apps" className="icon-mr"/>Connected Apps
        </Menu.Button>

        <Menu.Button href={`/user/api-access-tokens`}>
          <Icon icon="api-tokens" className="icon-mr"/>API Access Tokens
        </Menu.Button>
      </Menu>

      {organizationsMenu}
    </div>
  );
}

SettingsMenu.propTypes = {
  viewer: React.PropTypes.shape({
    organizations: React.PropTypes.shape({
      edges: React.PropTypes.array
    }).isRequired
  }).isRequired
};

export default SettingsMenu;
