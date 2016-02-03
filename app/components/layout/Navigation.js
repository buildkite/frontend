import React from 'react';
import classNames from 'classnames';

import UserAvatar from './../shared/UserAvatar';
import Button from './../shared/Button';
import Dropdown from './../shared/Dropdown';
import Badge from './../shared/Badge';
import AgentsCount from './../organization/AgentsCount';
import BuildsCountBadge from './../user/BuildsCountBadge';

const buttonClassNames = "btn black hover-lime focus-lime flex flex-center flex-none";

const NavigationButton = (props) => {
  return (
    <a href={props.href} style={props.style} className={buttonClassNames + " " + props.className}>{props.children}</a>
  );
}

NavigationButton.propTypes = {
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  href: React.PropTypes.string,
  children: React.PropTypes.node
};

const DropdownButton = (props) => {
  return (
    <button style={props.style} className={buttonClassNames + " " + props.className}>{props.children}</button>
  );
}

DropdownButton.propTypes = {
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  children: React.PropTypes.node
};

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
      })
    })
  };

  state = {
    showingOrgDropdown: false,
    showingUserDropdown: false
  };

  render() {
    return (
      <div className="border-bottom bg-silver mb3" style={{fontSize: 13}}>
        <div className="twbs-container">
          <div className="flex flex-stretch" style={{height: 45}}>
            <NavigationButton href="/" className="border-right px3 hover-faded-children" style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>
              <img src={require('../../images/logo.svg')} style={{width: 27, height: 18}} />
            </NavigationButton>

            <Dropdown align="left" width={250} className="flex" style={{ minWidth: "5em"}} onToggle={this.handleOrgDropdownToggle}>
              <DropdownButton className={classNames({ "lime": this.state.showingOrgDropdown })}
                              style={{
                                backgroundImage: 'url(' + require('../../images/nav-button-right-arrow.svg') + ')',
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
              <NavigationButton href="/organizations/new" className="block border-top py2"><i className="fa fa-plus-circle" style={{ marginRight: '.7rem' }}/>Create New Organization</NavigationButton>
            </Dropdown>

            {this._topOrganizationMenu()}

            <span className="flex-auto"></span>

            <NavigationButton className="md-flex" href={`/builds`}>My Builds <BuildsCountBadge className="hover-lime-child" viewer={this.props.viewer} /></NavigationButton>
            <NavigationButton className="md-flex" href={`/docs`}>Documentation</NavigationButton>
            <NavigationButton className="md-flex" href="mailto:support@buildkite.com">Support</NavigationButton>

            <Dropdown align="right" width={170} className="flex" onToggle={this.handleUserDropdownToggle}>
              <DropdownButton className={classNames({ "lime": this.state.showingUserDropdown })}
                              style={{paddingRight: 0, paddingLeft: '1rem'}}>
                <UserAvatar user={this.props.viewer.user} className="flex-none flex flex-center" style={{width: 26, height: 26, marginRight: '.4rem'}} />
                <span className="flex flex-center sm-flex"><span className="truncate" style={{maxWidth:"9em"}}>{this.props.viewer.user.name}</span></span>
                <span className="ml1 flex flex-center">
                  &#9662;
                </span>
              </DropdownButton>

              <NavigationButton className="md-hide" href={`/builds`}>My Builds <BuildsCountBadge className="hover-lime-child" viewer={this.props.viewer} /></NavigationButton>
              <NavigationButton href="/user/settings">Personal Settings</NavigationButton>

              <div className="md-hide">
                <NavigationButton className="md-hide" href={`/docs`}>Documentation</NavigationButton>
                <NavigationButton className="md-hide" href="mailto:support@buildkite.com">Support</NavigationButton>
              </div>

              <Button action="/logout" method="delete" className="black hover-lime focus-lime block left-align" style={{width: "100%"}}>Logout</Button>
            </Dropdown>
          </div>

        </div>

        {this._bottomOrganizationMenu()}
      </div>
    );
  }

  _topOrganizationMenu() {
    if (this.props.organization) {
      return (
        <span className="sm-flex">
          {this._organizationMenu()}
        </span>
      )
    }
  }

  _bottomOrganizationMenu() {
    if (this.props.organization) {
      return (
        <div className="border-top sm-hide">
          <div className="twbs-container flex flex-stretch" style={{height: 45}}>
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
    } else {
      return <span className="block px3 border-bottom gray">You’ve no other organizations</span>
    }
  }

  _organizationMenu(options = {}) {
    var organization = this.props.organization;
    var paddingLeft = options.paddingLeft != undefined ? options.paddingLeft : 15;

    if(organization) {
      return (
        <span className={classNames("flex", options.className)}>
          <NavigationButton style={{ paddingLeft: paddingLeft }} href={`/${organization.slug}`}>Projects</NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/agents`}>
            {'Agents'}
            <Badge className="hover-lime-child"><AgentsCount organization={organization} /></Badge>
          </NavigationButton>
          <NavigationButton href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
        </span>
      )
    }
  }
}

export default Navigation;
