import React from 'react';
import UserAvatar from './../shared/UserAvatar';
import NavigationMenu from './NavigationMenu';

require("../../css/Navigation.css")

class Navigation extends React.Component {
  render() {
    return (
      <div className="Navigation">
        <div className="Navigation__Inner">
          <img src={require('../../images/logo.svg')} className="Navigation__Logo" />

          <div className="Navigation__Organization">
            <div className="Navigation__Organization__Selector">
              <div className="Navigation__Organization__Label">
                {this._organizationSelectorLabel()}
              </div>

              <i className="Navigation__Organization__Caret fa fa-caret-down" />

              <div className="Navigation__Organization__Dropdown">
                <ul>
                  {
                    this.props.viewer.organizations.edges.map((org) =>
                      <li key={org.node.slug}>
                        <a href={`/${org.node.slug}`}>{org.node.name}</a>
                      </li>
                    )
                  }
                  <li>
                    <a href="/organizations/new"><i className="fa fa-plus-circle"/> Create New Organization</a>
                  </li>
                </ul>
              </div>
            </div>

            <img src={require('../../images/seperator.svg')} className="Navigation__Organization__Seperator" />

            {this._organizationMenu()}
          </div>

          <div className="Navigation__User">
            <UserAvatar size={30} user={this.props.viewer.user} />

            <div className="Navigation__User__Dropdown">
              <ul>
                <li>
                  <a href="/user/settings">Settings</a>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            </div>

            <div className="Navigation__User__Name">
              {this.props.viewer.user.name}
            </div>

            <i className="Navigation__User__Caret fa fa-caret-down" />
          </div>

          <div className="Navigation__Docs">
            <NavigationMenu>
              <a href={`/docs`}>Documentation</a>
              <a href="mailto:support@buildkite.com">Support</a>
            </NavigationMenu>
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
