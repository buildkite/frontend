import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Button from '../../shared/Button';
import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';
import UserAvatar from '../../shared/UserAvatar';

import FlashesStore from '../../../stores/FlashesStore';

import MemberEditRole from './role';

import OrganizationMemberDeleteMutation from '../../../mutations/OrganizationMemberDelete';

import TeamMemberRow from './TeamMemberRow';

const AVATAR_SIZE = 50;
const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 20;

class MemberEdit extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired,
        pageInfo: PropTypes.shape({
          hasNextPage: PropTypes.bool.isRequired
        }).isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    }),
    relay: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    removing: false,
    isSelf: false
  };

  componentWillMount() {
    this.setState({
      isSelf: this.props.organizationMember.user.id === this.props.viewer.user.id
    });
  }

  render() {
    if (!this.props.organizationMember) {
      return null;
    }

    return (
      <DocumentTitle title={`Users · ${this.props.organizationMember.user.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <UserAvatar
                user={this.props.organizationMember.user}
                className="align-middle mr2"
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              {this.props.organizationMember.user.name}
            </PageHeader.Title>
            <PageHeader.Description>
              {this.props.organizationMember.user.email}
            </PageHeader.Description>
            <PageHeader.Menu>{this.renderRemoveButton()}</PageHeader.Menu>
          </PageHeader>
          <MemberEditRole
            viewer={this.props.viewer}
            organizationMember={this.props.organizationMember}
          />
          {this.renderTeamsPanel()}
        </div>
      </DocumentTitle>
    );
  }

  renderTeamsPanel() {
    if (this.props.organizationMember.teams.edges.length > 0) {
      return (
        <Panel className="mb4">
          <Panel.Header>Teams</Panel.Header>
          {this.renderTeams()}
          {this.renderTeamsFooter()}
        </Panel>
      );
    }
  }

  renderTeams() {
    return this.props.organizationMember.teams.edges.map(({ node }) => (
      <TeamMemberRow
        key={node.id}
        teamMember={node}
      />
    ));
  }

  renderTeamsFooter() {
    // don't show any footer if we haven't ever loaded
    // any teams, or if there's no next page
    if (!this.props.organizationMember.teams || !this.props.organizationMember.teams.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreTeamsClick}
      >
        Show more teams…
      </Button>
    );

    // show a spinner if we're loading more teams
    if (this.state.loadingTeams) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleLoadMoreTeamsClick = () => {
    this.setState({ loadingTeams: true });

    let { teamsPageSize } = this.props.relay.variables;

    teamsPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { teamsPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loadingTeams: false });
        }
      }
    );
  };

  renderRemoveButton() {
    // Don't show the remove panel if you can't actually remove them
    if (!this.props.organizationMember.permissions.organizationMemberDelete.allowed) {
      return null;
    }

    const loading = this.state.removing && (
      this.state.isSelf
        ? 'Leaving Organization…'
        : 'Removing from Organization…'
    );

    return (
      <Button
        theme="error"
        loading={loading}
        onClick={this.handleRemoveClick}
      >
        {
          this.state.isSelf
            ? 'Leave Organization'
            : 'Remove from Organization'
        }
      </Button>
    );
  }

  handleRemoveClick = () => {
    const message = this.state.isSelf
      ? 'Removing yourself will immediately revoke your access to this organization.'
      : 'Removing this user will immediately revoke their access to this organization.';

    if (confirm(message)) {
      this.performRemove();
    }
  };

  performRemove = () => {
    // Show the removing indicator
    this.setState({ removing: true });

    const mutation = new OrganizationMemberDeleteMutation({
      organizationMember: this.props.organizationMember
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationFailure
    });
  };

  handleMutationSuccess = (response) => {
    this.setState({ removing: false });

    if (response.organizationMemberDelete.user.id === this.props.viewer.user.id) {
      // if we remove ourself, kickflip outta there
      // because we won't have access anymore!
      window.location = '/';
    } else {
      this.context.router.push(`/organizations/${response.organizationMemberDelete.organization.slug}/users`);
    }
  };

  handleMutationFailure = (transaction) => {
    this.setState({ removing: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(MemberEdit, {
  initialVariables: {
    teamsPageSize: INITIAL_PAGE_SIZE
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRole.getFragment('viewer')}
        user {
          id
        }
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditRole.getFragment('organizationMember')}
        uuid
        user {
          id
          name
          email
          avatar {
            url
          }
        }
        teams(first: $teamsPageSize, order: NAME) {
          count
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              ${TeamMemberRow.getFragment('teamMember')}
            }
          }
        }
        permissions {
          organizationMemberDelete {
            allowed
            message
          }
        }
        ${OrganizationMemberDeleteMutation.getFragment('organizationMember')}
      }
    `
  }
});
