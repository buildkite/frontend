import React from 'react';
import classNames from 'classnames';

import UserAvatar from './../../shared/UserAvatar';
import Dropdown from './../../shared/Dropdown';
import Badge from './../../shared/Badge';
import Icon from './../../shared/Icon';
import AgentsCount from './../../organization/AgentsCount';
import BuildsCountBadge from './../../user/BuildsCountBadge';
import NewChangelogsBadge from './../../user/NewChangelogsBadge';
import permissions from './../../../lib/permissions';

import NavigationButton from './navigation-button';
import DropdownButton from './dropdown-button';

class Navigation extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object,
    viewer: React.PropTypes.shape({
      user: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        avatar: React.PropTypes.shape({
          url: React.PropTypes.string.isRequired
        })
      }),
      organizations: React.PropTypes.shape({
        edges: React.PropTypes.array
      }),
      unreadChangelogs: React.PropTypes.shape({
        count: React.PropTypes.integer
      })
    })
  };

  state = {
    showingOrgDropdown: false,
    showingUserDropdown: false
  };

  render() {
    return (
      <div className="border-bottom border-gray bg-silver" style={{fontSize: 13, marginBottom: 25}}>
        <div className="container">
          <div className="flex flex-stretch" style={{height: 45}}>
            <span className="flex relative border-right border-gray items-center">
              <NavigationButton href="/" className="px3 hover-faded-children" style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>
                <img src={require('./logo.svg')} style={{width: 27, height: 18, marginTop: 3}} />
              </NavigationButton>
              {this._newChangelogsBadge()}
            </span>

            <Dropdown align="left" width={250} className="flex" style={{ minWidth: "5em"}} onToggle={this.handleOrgDropdownToggle}>
              <DropdownButton className={classNames({ "lime": this.state.showingOrgDropdown })}
                              style={{
                                backgroundImage: 'url(' + require('./nav-button-right-arrow.svg') + ')',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center right',
                                paddingRight: 20}}>
                <span className="truncate" style={{maxWidth:"10em"}}>
                  {this._organizationSelectorLabel()}
                </span>
                <span className="ml1">
                  &#9662;
                </span>
              </DropdownButton>
              {this._organizationsList()}
              <NavigationButton href="/organizations/new" className="block"><Icon icon="plus-circle" className="icon-mr" style={{width: 12, height: 12}} />Create New Organization</NavigationButton>
            </Dropdown>

            {this._topOrganizationMenu()}

            <span className="flex-auto"></span>

            <NavigationButton className="xs-hide sm-hide" href={`/builds`}>My Builds <BuildsCountBadge className="hover-lime-child" viewer={this.props.viewer} /></NavigationButton>
            <NavigationButton className="xs-hide sm-hide" href={`/docs`}>Documentation</NavigationButton>
            <NavigationButton className="xs-hide sm-hide" href="mailto:support@buildkite.com">Support</NavigationButton>

            <Dropdown align="right" width={170} className="flex" onToggle={this.handleUserDropdownToggle}>
              <DropdownButton className={classNames({ "lime": this.state.showingUserDropdown })}
                              style={{paddingRight: 0}}>
                <UserAvatar user={this.props.viewer.user} className="flex-none flex items-center mr1" style={{width: 26, height: 26}} />
                <span className="flex items-center xs-hide"><span className="truncate" style={{maxWidth:"9em"}} data-current-user-name={true}>{this.props.viewer.user.name}</span></span>
                <span className="ml1 flex items-center">
                  &#9662;
                </span>
              </DropdownButton>

              <NavigationButton className="md-hide lg-hide" href={`/builds`}>My Builds <BuildsCountBadge className="hover-lime-child" viewer={this.props.viewer} /></NavigationButton>
              <NavigationButton href="/user/settings">Personal Settings</NavigationButton>

              <div className="md-hide lg-hide">
                <NavigationButton className="md-hide lg-hide" href={`/docs`}>Documentation</NavigationButton>
                <NavigationButton className="md-hide lg-hide" href="mailto:support@buildkite.com">Support</NavigationButton>
              </div>

              <form action="/logout" method="post" ref={c => this.logoutFormNode = c}>
                <input type="hidden" name="_method" value={"delete"} />
                <input type="hidden" name={window._csrf.param} value={window._csrf.token} />
                <NavigationButton onClick={this.handleLogoutClick}>Logout</NavigationButton>
              </form>
            </Dropdown>
          </div>

        </div>

        {this._bottomOrganizationMenu()}
      </div>
    );
  }

  _newChangelogsBadge() {
    return (
      <NewChangelogsBadge className="mr2 relative" style={{ top: -5, marginLeft: -8 }} viewer={this.props.viewer} />
    )
  }

  _topOrganizationMenu() {
    if (this.props.organization) {
      return (
        <span className="flex xs-hide">
          {this._organizationMenu()}
        </span>
      )
    }
  }

  _bottomOrganizationMenu() {
    if (this.props.organization) {
      return (
        <div className="border-top border-gray sm-hide md-hide lg-hide">
          <div className="container flex flex-stretch" style={{height: 45}}>
            {this._organizationMenu({ paddingLeft: 0 })}
          </div>
        </div>
      )
    }
  }

  handleOrgDropdownToggle = (visible) => {
    this.setState({ showingOrgDropdown: visible });
  };

  handleUserDropdownToggle = (visible) => {
    this.setState({ showingUserDropdown: visible });
  };

  handleLogoutClick = (e) => {
    e.preventDefault();
    this.logoutFormNode.submit();
  };

  _organizationSelectorLabel() {
    if(this.props.organization) {
      return this.props.organization.name;
    } else {
      return "Organizations"
    }
  }

  _organizationsList() {
    let nodes = [];
    this.props.viewer.organizations.edges.forEach((org) => {
      // Don't show the active organization in the selector
      if(!this.props.organization || (org.node.slug != this.props.organization.slug)) {
        nodes.push(<NavigationButton key={org.node.slug} href={`/${org.node.slug}`} className="block">{org.node.name}</NavigationButton>);
      }
    });

    if(nodes.length > 0) {
      return nodes;
    }
  }

  _organizationMenu(options = {}) {
    let organization = this.props.organization;
    let paddingLeft = options.paddingLeft != undefined ? options.paddingLeft : 15;

    if(organization) {
      return (
        <div className={classNames("flex", options.className)}>
          <NavigationButton style={{ paddingLeft: paddingLeft }} href={`/${organization.slug}`}>Pipelines</NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/agents`}>
            {'Agents'}
            <Badge className="hover-lime-child"><AgentsCount organization={organization} /></Badge>
          </NavigationButton>

          {this.renderOrganizationSettingsButton()}
        </div>
      )
    }
  }

  renderOrganizationSettingsButton() {
    let organization = this.props.organization;

    // Returns the first permission that's allowed. First, we'll try and render
    // the "Settings" button as is, which requires all the permissions to be
    // allowed. If that doesn't work, see if they _just_ have the teamAdmin
    // permission, and show them a nice "Team Settings" button. If both of
    // those don't work, but they do have any other permission, show the
    // regular settings button.
    return permissions(organization.permissions).first(
      {
        any: true,
        render: () => <NavigationButton href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
      },
      {
        only: "teamAdmin",
        render: () => <NavigationButton href={`/organizations/${organization.slug}/teams`}>Teams</NavigationButton>
      },
      {
        any: true,
        render: () => <NavigationButton href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
      }
    )
  }
}

export default Navigation;
