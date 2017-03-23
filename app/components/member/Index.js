import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import permissions from '../../lib/permissions';

import InvitationRow from './InvitationRow';
import Row from './Row';

const PAGE_SIZE = 8;

class MemberIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.object.isRequired,
      members: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        pageInfo: React.PropTypes.shape({
          hasNextPage: React.PropTypes.bool.isRequired
        }).isRequired,
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }),
      invitations: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          })
        ).isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    loadingMembers: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    // Use a `forceFetch` so every time the user comes back to this page we'll
    // grab fresh data.
    this.props.relay.forceFetch({ isMounted: true });
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
            {this.renderMembers()}
            {this.renderMemberFooter()}
          </Panel>

          <Panel>
            <Panel.Header>Invitations</Panel.Header>
            {this.renderInvitations()}
          </Panel>
        </div>
      </DocumentTitle>
    );
  }

  renderNewMemberButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "organizationInvitationCreate",
        render: () => <Button link={`/organizations/${this.props.organization.slug}/users/new`} theme="default" outline={true}>Invite Users</Button>
      }
    );
  }

  renderMembers() {
    const { members } = this.props.organization;

    if (!members) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    } else {
      return members.edges.map((edge) => {
        return (
          <Row
            key={edge.node.id}
            organization={this.props.organization}
            organizationMember={edge.node}
          />
        );
      });
    }
  }

  renderMemberFooter() {
    // don't show any footer if we haven't ever loaded
    // any members, or if there's no next page
    if (!this.props.organization.members || !this.props.organization.members.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreMembersClick}
      >
        Load more users…
      </Button>
    );

    // show a spinner if we're loading more members
    if (this.state.loadingMembers) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleLoadMoreMembersClick = () => {
    this.setState({ loadingMembers: true });

    let { memberPageSize } = this.props.relay.variables;

    memberPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { memberPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loadingMembers: false });
        }
      }
    );
  };

  renderInvitations() {
    const invitations = this.props.organization.invitations;

    if (!invitations) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    } else {
      if (invitations.edges.length > 0) {
        return (
          invitations.edges.map((edge) => {
            return (
              <InvitationRow
                key={edge.node.id}
                organization={this.props.organization}
                organizationInvitation={edge.node}
              />
            );
          })
        );
      } else {
        return (
          <Panel.Section>
            <div className="dark-gray">There are no pending invitations</div>
          </Panel.Section>
        );
      }
    }
  }
}

export default Relay.createContainer(MemberIndex, {
  initialVariables: {
    isMounted: false,
    memberPageSize: PAGE_SIZE
  },

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
        members(first: $memberPageSize, order: NAME) @include(if: $isMounted) {
          count
          edges {
            node {
              id
              ${Row.getFragment('organizationMember')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
        invitations(first: 100, state: PENDING) @include(if: $isMounted) {
          edges {
            node {
              id
              ${InvitationRow.getFragment('organizationInvitation')}
            }
          }
        }
      }
    `
  }
});
