import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import MemberEditForm from './form';
import MemberEditRemove from './remove';

class Edit extends React.PureComponent {
  static displayName = "Member.Edit";

  static propTypes = {
    organizationMember: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <MemberEditForm organizationMember={this.props.organizationMember} />
        <MemberEditRemove viewer={this.props.viewer} organizationMember={this.props.organizationMember} />
      </div>
    );
  }
}

export default Relay.createContainer(Edit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRemove.getFragment('viewer')}
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditForm.getFragment('organizationMember')}
        ${MemberEditRemove.getFragment('organizationMember')}
      }
    `
  }
});
