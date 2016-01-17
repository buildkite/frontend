import React from 'react';
import Relay from 'react-relay';
import { IndexLink, Link } from 'react-router';

class OrganizationSettingsSection extends React.Component {
  render(){
    return (
      <div className="container">
       <div className="row">
         <div className="col-md-3">
           <div className="list-group account-settings-navigation-group">
             <span className="list-group-item list-group-item-header"><strong>{this.props.viewer.organization.name}</strong></span>
             <a className="list-group-item " href={`/organizations/${this.props.viewer.organization.slug}/settings`}><i className="fa fa-cog"></i> Settings</a>
             <a className="list-group-item " href={`/organizations/${this.props.viewer.organization.slug}/members`}><i className="fa fa-users"></i> Members <span className="badge pull-right">{this.props.viewer.organization.members.count}</span></a>
             <a className="list-group-item " href={`/organizations/${this.props.viewer.organization.slug}/services`}><i className="fa fa-bell"></i> Notifications</a>
             <a className="list-group-item " href={`/organizations/${this.props.viewer.organization.slug}/billing`}><i className="fa fa-credit-card"></i> Billing</a>
           </div>

           <div className="list-group account-settings-navigation-group">
             <a className="list-group-item" href="/user/settings"><strong>Personal Settings</strong></a>
           </div>
         </div>

         <div className="col-md-9">
           {this.props.children}
         </div>
       </div>
      </div>
    );
  }
}

export default Relay.createContainer(OrganizationSettingsSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name,
        slug,
        members {
         count
        }
      }
    `
  }
});
