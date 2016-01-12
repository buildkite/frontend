import React from 'react';

import UserAvatar from './../shared/UserAvatar';
import NavigationDropdown from './NavigationDropdown';

class Navigation extends React.Component {
  render() {
    return (
      <div className="border-bottom bg-gray flex flex-center mxn1" style={{fontSize: 13}}>
        <img src={require('../../images/logo.svg')}  style={{ height: 30, marginTop: 8 }} />

        <NavigationDropdown>
          <span>{this._organizationSelectorLabel()}</span>
          {
            this.props.viewer.organizations.edges.map((org) =>
              <a key={org.node.slug} href={`/${org.node.slug}`} className="btn black hover-lime focus-lime">{org.node.name}</a>
            )
          }
          <a href="/organizations/new" className="btn black hover-lime focus-lime"><i className="fa fa-plus-circle"/> Create New Organization</a>
        </NavigationDropdown>

        <img src={require('../../images/seperator.svg')} style={{ height: 47 }} />

        {this._organizationMenu()}

        <div className="flex-grow" />

	<a href={`/docs`} className="btn black hover-lime focus-lime">Documentation</a>
	<a href="mailto:support@buildkite.com" className="btn black hover-lime focus-lime">Support</a>

        <NavigationDropdown>
          <span>
            <UserAvatar size={30} user={this.props.viewer.user} />
            {this.props.viewer.user.name}
          </span>
          <a href="/user/settings" className="btn black hover-lime focus-lime">Settings</a>
          <a href="/logout" className="btn black hover-lime focus-lime">Logout</a>
        </NavigationDropdown>
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
        <div>
          <a href={`/${organization.slug}`} className="btn black hover-lime focus-lime">Projects</a>
          <a href={`/organizations/${organization.slug}/agents`} className="btn black hover-lime focus-lime">Agents <span className="Navigation__Badge">12</span></a>
          <a href={`/organizations/${organization.slug}/settings`} className="btn black hover-lime focus-lime">Settings</a>
        </div>
      )
    }
  }
};

export default Navigation;
