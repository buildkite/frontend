import React from 'react';
import Relay from 'react-relay';

import SettingsMenu from './SettingsMenu';

const SettingsSection = (props) =>
  <div className="twbs-container">
    <div className="clearfix mxn2">
      <div className="md-col md-col-3 px2">
        <SettingsMenu organization={props.organization} />
      </div>
      <div className="md-col md-col-9 px2">
        {props.children}
      </div>
    </div>
  </div>

SettingsSection.propTypes = {
  organization: React.PropTypes.object.isRequired,
  children: React.PropTypes.node.isRequired
};

export default Relay.createContainer(SettingsSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        members {
          count
        }
        invitations {
          count
        }
        teams {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberCreate {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamAdmin {
            allowed
          }
        }
      }
    `
  }
});
