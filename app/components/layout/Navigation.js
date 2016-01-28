import React from 'react';
import classNames from 'classnames';

import UserAvatar from './../shared/UserAvatar';
import Button from './../shared/Button';
import Dropdown from './../shared/Dropdown';
import AgentsCount from './../organization/AgentsCount';

const NavigationButton = (props) => {
  let classes = classNames("btn black hover-lime focus-lime", props.className);

  return (
    <a href={props.href} style={props.style} className={classes}>{props.children}</a>
  );
}

NavigationButton.propTypes = {
  className: React.PropTypes.string,
  href: React.PropTypes.string,
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

  render() {
    return (
      <div className="border-bottom bg-silver mb3" style={{fontSize: 13}}>
        <div className="twbs-container">
          <div className="flex flex-stretch" style={{height: 45}}>
            <NavigationButton href="/" className="border-right flex flex-center flex-none px3 hover-faded-children" style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>
              <img src={require('../../images/logo.svg')} style={{width: 27, height: 18}} />
            </NavigationButton>

            <Dropdown align="left" width={250} className="flex flex-none">
              <NavigationButton className="flex flex-center flex-none user-select-none" style={{backgroundImage: 'url(' + require('../../images/nav-button-right-arrow.svg') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center right', paddingRight: 20}}>
                <span className="truncate" style={{maxWidth:"10em"}}>
                  {this._organizationSelectorLabel()}
                </span>
                <span className="ml1">
                  &#9662;
                </span>
              </NavigationButton>
              {this._organizationsList()}
              <a href="/organizations/new" className="btn black hover-lime focus-lime block py2"><i className="fa fa-plus-circle"/> Create New Organization</a>
            </Dropdown>

            {this._organizationMenu()}

            <span className="flex-auto"></span>

            <NavigationButton className="flex flex-center flex-none" href={`/docs`}>Documentation</NavigationButton>
            <NavigationButton className="flex flex-center flex-none" href="mailto:support@buildkite.com">Support</NavigationButton>

            <Dropdown align="right" width={170} className="flex">
              <NavigationButton className="flex flex-center flex-none user-select-none" style={{paddingRight: 0, paddingLeft: '1rem'}}>
                <UserAvatar user={this.props.viewer.user} className="flex-none" style={{width: 26, height: 26, marginRight: '.7rem'}} />
                <span className="truncate" style={{maxWidth:"9em"}}>{this.props.viewer.user.name}</span>
                <span className="ml1">
                  &#9662;
                </span>
              </NavigationButton>

              <a href="/user/settings" className="btn black hover-lime focus-lime block border-bottom py2">Personal Settings</a>
              <Button action="/logout" method="delete" className="black hover-lime focus-lime block py2 left-align" style={{width: "100%"}}>Logout</Button>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }

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
        nodes.push(<a key={org.node.slug} href={`/${org.node.slug}`} className="btn black hover-lime focus-lime border-bottom block py2">{org.node.name}</a>);
      }
    });

    if(nodes.length > 0) {
      return nodes;
    } else {
      return <span className="block py2 px3 border-bottom gray">You’ve no other organizations</span>
    }
  }

  _organizationMenu() {
    var organization = this.props.organization;

    if(organization) {
      return (
        <span className="flex">
          <NavigationButton className="flex flex-center flex-none" style={{paddingLeft: 15}} href={`/${organization.slug}`}>Projects</NavigationButton>
          <NavigationButton className="flex flex-center flex-none" href={`/organizations/${organization.slug}/agents`}>Agents <span className="inline-block bg-black white rounded p1 ml1 small hover-lime-child"><AgentsCount organization={organization} /></span></NavigationButton>
          <NavigationButton className="flex flex-center flex-none" href={`/organizations/${organization.slug}/settings`}>Settings</NavigationButton>
        </span>
      )
    }
  }
}

export default Navigation;
