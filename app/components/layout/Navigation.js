import React from 'react';

import UserAvatar from './../shared/UserAvatar';
import NavigationMenu from './NavigationMenu';
import NavigationDropdown from './NavigationDropdown';

require("../../css/Navigation.css")

class Navigation extends React.Component {
  render() {
    return (
      <div className="Navigation">
        <div className="Navigation__Inner">
          <div className="flex">
            <img src={require('../../images/logo.svg')}  style={{ height: 30, marginTop: 8 }} />

            <NavigationDropdown>
              {this._organizationSelectorLabel()}
              {
                this.props.viewer.organizations.edges.map((org) =>
                  <a key={org.node.slug} href={`/${org.node.slug}`}>{org.node.name}</a>
                )
              }
              <a href="/organizations/new"><i className="fa fa-plus-circle"/> Create New Organization</a>
            </NavigationDropdown>

            <img src={require('../../images/seperator.svg')} style={{ height: 47}} />

            {this._organizationMenu()}

            <div className="flex-grow" />

            <NavigationMenu>
              <a href={`/docs`}>Documentation</a>
              <a href="mailto:support@buildkite.com">Support</a>
            </NavigationMenu>

            <NavigationDropdown>
              <span>
                <UserAvatar size={30} user={this.props.viewer.user} />
                {this.props.viewer.user.name}
              </span>
              <a href="/user/settings">Settings</a>
              <a href="/logout">Logout</a>
            </NavigationDropdown>
          </div>
        </div>
      </div>
    );
  }

  _currentOrganization() {
    var organization;
    this.props.viewer.organizations.edges.forEach(org => {
      if(org.node.slug == this.props.params.organization) {
        organization = org.node;
      }
    });

    return organization;
  }

  _organizationSelectorLabel() {
    var organization = this._currentOrganization();

    if(organization) {
      return organization.name;
    } else {
      return "Organizations"
    }
  }

  _organizationMenu() {
    var organization = this._currentOrganization();

    if(organization) {
      return (
        <NavigationMenu>
          <a href={`/${organization.slug}`}>Projects</a>
          <a href={`/organizations/${organization.slug}/agents`}>Agents <span className="Navigation__Badge">12</span></a>
          <a href={`/organizations/${organization.slug}/settings`}>Settings</a>
        </NavigationMenu>
      )
    }
  }
};

export default Navigation;
