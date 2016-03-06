import React from 'react';
import Relay from 'react-relay';

import PageWithMenu from '../shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

const SettingsSection = (props) => <PageWithMenu>
  <SettingsMenu organization={props.organization} />
  {props.children}
</PageWithMenu>

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
