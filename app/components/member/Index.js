import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import permissions from '../../lib/permissions';

import InvitationRow from './InvitationRow';
import Row from './Row';

class MemberIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.object.isRequired,
      invitations: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      members: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <DocumentTitle title={`Users · ${this.props.organization.name}`}>
        <div>
          <Panel className="mb4">
            <Panel.Header>Users</Panel.Header>
            <Panel.IntroWithButton>
              <span>Invite people to this organization so they can see and create builds, manage pipelines, and customize their notification preferences.</span>
              {this.renderNewMemberButton()}
            </Panel.IntroWithButton>
            {this.props.organization.members.edges.map((edge) => (
              <Row
                key={edge.node.id}
                organization={this.props.organization}
                organizationMember={edge.node}
              />
            ))}
          </Panel>
          {this.renderInvitations()}
        </div>
      </DocumentTitle>
    );
  }

  renderNewMemberButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "organizationInvitationCreate",
        render: () => <Button href={`/organizations/${this.props.organization.slug}/users/new`} theme="success">Invite New Users</Button>
      }
    );
  }

  renderInvitations() {
    if (!this.props.organization.invitations.edges) {
      return;
    }

    return (
      <Panel>
        <Panel.Header>Invitations</Panel.Header>
        {this.props.organization.invitations.edges.map((edge) => (
          <InvitationRow
            key={edge.node.id}
            organization={this.props.organization}
            organizationInvitation={edge.node}
          />
        ))}
      </Panel>
    );
  }
}

export default Relay.createContainer(MemberIndex, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        ${Row.getFragment('organization')}
        permissions {
          organizationInvitationCreate {
            allowed
          }
        }
        invitations(first: 100, state: PENDING, order: RECENTLY_CREATED) {
          edges {
            node {
              id
              ${InvitationRow.getFragment('organizationInvitation')}
            }
          }
        }
        members(first: 100) {
          edges {
            node {
              id
              ${Row.getFragment('organizationMember')}
            }
          }
        }
      }
    `
  }
});
