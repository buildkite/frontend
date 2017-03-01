import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Panel from '../shared/Panel';

class InvitationRow extends React.Component {
  static propTypes = {
    organizationInvitation: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Panel.Row key={this.props.organizationInvitation.uuid}>
        <div className="flex flex-stretch items-center">
          <div className="flex-auto">
            <div className="m0">
              {this.props.organizationInvitation.email}
            </div>
          </div>
        </div>
      </Panel.Row>
    );
  }
}

export default Relay.createContainer(InvitationRow, {
  fragments: {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
        uuid
        email
      }
    `
  }
});
