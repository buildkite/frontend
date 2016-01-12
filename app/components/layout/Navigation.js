import React from 'react';

import UserAvatar from './../shared/UserAvatar';
import NavigationDropdown from './NavigationDropdown';

class NavigationButton extends React.Component {
  render() {
    var className = `btn black hover-lime focus-lime ${this.props.className}`;

    return (
      <a href={this.props.href} className={className}>{this.props.children}{this._badgeNode()}</a>
    );
  }

  _badgeNode() {
    if(this.props.badge) {
      return (
        <span className="inline-block bg-black white rounded p1 ml1 small">{this.props.badge}</span>
      );
    }
  }
}

class Navigation extends React.Component {
  render() {
    return (
      <div className="border-bottom bg-gray mb3" style={{fontSize: 13}}>
        <div className="twbs-container">
          <div className="flex flex-center">
            <img src={require('../../images/logo.svg')}  style={{height: 30}} className="mr3" />

            <NavigationDropdown className="flex flex-center">
              <div className="bold">
                <div className="truncate sm-show" style={{maxWidth: 200}}>
                  {this._organizationSelectorLabel()}
                </div>
                <div className="truncate sm-hide" style={{maxWidth: 100}}>
                  {this._organizationSelectorLabel()}
                </div>
              </div>

              {
                this.props.viewer.organizations.edges.map((org) =>
                  <a key={org.node.slug} href={`/${org.node.slug}`} className="btn black hover-lime focus-lime border-bottom block py2">{org.node.name}</a>
                )
              }

              <a href="/organizations/new" className="btn black hover-lime focus-lime block py2"><i className="fa fa-plus-circle"/> Create New Organization</a>
            </NavigationDropdown>

            {this._organizationMenu()}

            <div className="flex-grow"></div>

            <NavigationButton href={`/docs`} className="md-show">Documentation</NavigationButton>
            <NavigationButton href="mailto:support@buildkite.com" className="md-show">Support</NavigationButton>

            <NavigationDropdown className="ml2 flex flex-center">
              <div className="flex flex-center bold">
                <UserAvatar user={this.props.viewer.user} style={{width: 30, height: 30}} className="mr1" />
                <span className="md-show">{this.props.viewer.user.name}</span>
              </div>

              <a href={`/docs`} className="btn black hover-lime focus-lime sm-show block border-bottom py2">Documentation</a>
              <a href="mailto:support@buildkite.com" className="btn black hover-lime focus-lime sm-show block border-bottom py2">Support</a>
              <a href="/user/settings" className="btn black hover-lime focus-lime block border-bottom py2">Settings</a>
              <a href="/logout" className="btn black hover-lime focus-lime block py2">Logout</a>
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
        <div className="flex flex-center">
          <img src={require('../../images/seperator.svg')} style={{ height: 47 }} className="ml2" />

          <NavigationButton href={`/${organization.slug}`}>Projects</NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/agents`} badge={12} className="sm-show">Agents</NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/agents`} className="sm-hide">Agents</NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
        </div>
      )
    }
  }
};

export default Navigation;
