// @flow

import React from 'react';
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
          <Menu.Button
            icon="two-factor"
            href="/user/two-factor"
            label="Two-Factor Authentication"
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
        {this.renderOrganizationMenu()}
      </div>
    );
  }

  renderOrganizationMenu() {
    if (this.props.viewer.organizations && this.props.viewer.organizations.edges) {
      const organizations = this.props.viewer.organizations.edges.reduce((memo, org) => {
        return memo.concat((org && org.node) ? (
          <Menu.Button
            key={org.node.slug}
            href={`/organizations/${org.node.slug}/settings`}
            label={org.node.name}
            badge={org.node.permissions && org.node.permissions.pipelineView && !org.node.permissions.pipelineView.allowed && org.node.permissions.pipelineView.code === "sso_authorization_required" && "SSO"}
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
              pipelineView {
                allowed
                code
              }
            }
          }
        }
      }
    }
  `
);


