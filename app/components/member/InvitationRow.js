import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from '../shared/Button';
import Panel from '../shared/Panel';
import Badge from '../shared/Badge';

import FlashesStore from '../../stores/FlashesStore';

import OrganizationInvitationResend from '../../mutations/OrganizationInvitationResend';
import OrganizationInvitationRevoke from '../../mutations/OrganizationInvitationRevoke';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';
import OrganizationMemberSSOModeConstants from '../../constants/OrganizationMemberSSOModeConstants';

class InvitationRow extends React.PureComponent {
  static propTypes = {
    organizationInvitation: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      sso: PropTypes.shape({
        mode: PropTypes.string
      }).isRequired
    }).isRequired
  };

  state = {
    resending: false,
    revoking: false
  };

  render() {
    const { resending, revoking } = this.state;
    const inProgress = resending || revoking;

    const resendLabel = 'Resend Invitation';
    const revokeLabel = 'Revoke';

    return (
      <Panel.Row key={this.props.organizationInvitation.uuid}>
        <div className="flex flex-stretch items-center">
          <div className="flex-auto">
            <div className="m0 flex items-center">
              {this.props.organizationInvitation.email}
              {this.renderLabels()}
            </div>
          </div>
          <div className="flex-none">
            <Button
              className="ml1"
              theme="default"
              outline={true}
              loading={inProgress && (resending ? "Resending Invitation…" : resendLabel)}
              onClick={this.handleResendInvitationClick}
            >
              {resendLabel}
            </Button>
            <Button
              className="ml1"
              theme="default"
              outline={true}
              loading={inProgress && (revoking ? "Revoking…" : revokeLabel)}
              onClick={this.handleRevokeInvitationClick}
            >
              {revokeLabel}
            </Button>
          </div>
        </div>
      </Panel.Row>
    );
  }

  renderLabels() {
    const nodes = [];

    if (this.props.organizationInvitation.sso.mode === OrganizationMemberSSOModeConstants.OPTIONAL) {
      nodes.push(
        <div key={1} className="flex ml1">
          <Badge outline={true} className="regular">SSO Optional</Badge>
        </div>
      );
    }

    if (this.props.organizationInvitation.role === OrganizationMemberRoleConstants.ADMIN) {
      nodes.push(
        <div key={2} className="flex ml1">
          <Badge outline={true} className="regular">Administrator</Badge>
        </div>
      );
    }

    return nodes;
  }

  handleResendInvitationClick = () => {
    // Show the resending indicator
    this.setState({ resending: true });

    const mutation = new OrganizationInvitationResend({
      organizationInvitation: this.props.organizationInvitation
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleResendInvitationMutationSuccess,
      onFailure: this.handleResendInvitationMutationFailure
    });
  }

  handleResendInvitationMutationSuccess = (response) => {
    this.setState({ resending: false });

    const email = response.organizationInvitationResend.organizationInvitation.email;
    FlashesStore.flash(FlashesStore.SUCCESS, `An invitation email was resent to ${email}`);
  }

  handleResendInvitationMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ resending: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }

  handleRevokeInvitationClick = () => {
    // Show the revoking indicator
    this.setState({ revoking: true });

    const mutation = new OrganizationInvitationRevoke({
      organizationInvitation: this.props.organizationInvitation
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleRevokeInvitationMutationSuccess,
      onFailure: this.handleRevokeInvitationMutationFailure
    });
  }

  handleRevokeInvitationMutationSuccess = (response) => {
    this.setState({ revoking: false });

    const email = response.organizationInvitationRevoke.organizationInvitation.email;
    FlashesStore.flash(FlashesStore.SUCCESS, `The invitation to ${email} was revoked`);
  }

  handleRevokeInvitationMutationFailure = (transaction) => {
    // Hide the revoking indicator
    this.setState({ revoking: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(InvitationRow, {
  fragments: {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
        uuid
        email
        role
        sso {
          mode
        }
        ${OrganizationInvitationResend.getFragment('organizationInvitation')}
        ${OrganizationInvitationRevoke.getFragment('organizationInvitation')}
      }
    `
  }
});
