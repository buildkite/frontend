// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Menu from 'app/components/shared/Menu';
import type { SettingsMenu_viewer } from './__generated__/SettingsMenu_viewer.graphql';

type Props = {
  viewer: SettingsMenu_viewer
};

export default class SettingsMenu extends React.Component<Props> {
  render() {
    return (
      <div>
        <Menu>
          <Menu.Header>Personal Settings</Menu.Header>
          <Menu.Button
            icon="settings"
            href="/user/settings"
            label="Profile & Password"
          />
          {/* $FlowExpectError */}
          {Features.TwoFactorAuthentication ? (
            <Menu.Button
              icon="two-factor"
              href="/user/two-factor"
              label="Two-factor Authentication"
            />
          ) : null}
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
        {this.renderOrganizationMenu()}
      </div>
    );
  }

  renderOrganizationMenu() {
    if (this.props.viewer.organizations && this.props.viewer.organizations.edges) {
      const organizations = this.props.viewer.organizations.edges.reduce((memo, organization) => {
        return memo.concat((
          organization &&
          organization.node &&
          organization.node.permissions &&
          organization.node.permissions.organizationUpdate &&
          organization.node.permissions.organizationUpdate.allowed
        ) ? (
          <Menu.Button
              key={organization.node.slug}
              href={`/organizations/${organization.node.slug}/settings`}
              label={organization.node.name}
            />
          ) : null);
      }, []).filter(Boolean);

      if (organizations.length) {
        return (
          <Menu>
            <Menu.Header>Organization Settings</Menu.Header>
            {organizations}
          </Menu>
        );
      }
    }

    return null;
  }
}

export const SettingsMenuFragment = createFragmentContainer(
  SettingsMenu,
  graphql`
    fragment SettingsMenu_viewer on Viewer {
      organizations(first: 10) {
        edges {
          node {
            name
            slug
            permissions {
              organizationUpdate {
                allowed
              }
            }
          }
        }
      }
    }
  `
);


