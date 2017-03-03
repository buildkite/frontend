import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import Panel from '../shared/Panel';
import Emojify from '../shared/Emojify';

import OrganizationInvitationResend from '../../mutations/OrganizationInvitationResend';
import OrganizationInvitationRevoke from '../../mutations/OrganizationInvitationRevoke';

class InvitationRow extends React.Component {
  static propTypes = {
    organizationInvitation: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    resending: false,
    revoking: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { resending, revoking } = this.state;
    const inProgress = resending || revoking;

    const resendLabel = 'Resend Invitation';
    const revokeLabel = 'Revoke';

    return (
      <Panel.Row key={this.props.organizationInvitation.uuid}>
        <div className="flex flex-stretch items-center">
          <div className="flex-auto">
            <div className="m0">
              {this.props.organizationInvitation.email}
              {this.props.organizationInvitation.admin && <span className="dark-gray regular h6 ml1">Organization Administrator</span>}
            </div>
            {this.renderTeamAssignments()}
          </div>
          <div className="flex-none">
            <Button
              className="ml1"
              theme="default"
              outline={true}
              loading={inProgress && (resending ? "Resending Invitation..." : resendLabel)}
              onClick={this.handleResendInvitationClick}
            >
              {resendLabel}
            </Button>
            <Button
              className="ml1"
              theme="default"
              outline={true}
              loading={inProgress && (revoking ? "Revoking..." : revokeLabel)}
              onClick={this.handleRevokeInvitationClick}
            >
              {revokeLabel}
            </Button>
          </div>
        </div>
      </Panel.Row>
    );
  }

  renderTeamAssignments() {
    let edges = this.props.organizationInvitation.teams.edges;

    if(edges && edges.length) {
      return this.props.organizationInvitation.teams.edges.map((edge) => {
        return <div className="dark-gray mt1"><Emojify text={edge.node.team.name} /> as a {this.roleLabel(edge.node.role)}</div>;
      });
    }
  }

  roleLabel(value) {
    switch (value) {
      case "ADMIN":
        return "Team Admin";
      case "MEMBER":
        return "Member";
    }
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

  handleResendInvitationMutationSuccess = () => {
    this.setState({ resending: false });
  }

  handleResendInvitationMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ resending: false });

    alert(transaction.getError());
  }

  handleRevokeInvitationClick = () => {
    // Show the revoking indicator
    this.setState({ revoking: true });

    const mutation = new OrganizationInvitationRevoke({
      organizationInvitation: this.props.organizationInvitation
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleResendInvitationMutationSuccess,
      onFailure: this.handleResendInvitationMutationFailure
    });
  }

  handleRevokeInvitationMutationSuccess = () => {
    this.setState({ revoking: false });
  }

  handleRevokeInvitationMutationFailure = (transaction) => {
    // Hide the revoking indicator
    this.setState({ revoking: false });

    alert(transaction.getError());
  }
}

export default Relay.createContainer(InvitationRow, {
  fragments: {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
        uuid
        email
        admin
        teams(first: 100) {
          edges {
            node {
              id
              role
              team {
                name
              }
            }
          }
        }
        ${OrganizationInvitationResend.getFragment('organizationInvitation')}
        ${OrganizationInvitationRevoke.getFragment('organizationInvitation')}
      }
    `
  }
});
