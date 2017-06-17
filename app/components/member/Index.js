import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';
import DocumentTitle from 'react-document-title';

import Button from '../shared/Button';
import Dropdown from '../shared/Dropdown';
import Icon from '../shared/Icon';
import LoadMoreFooter from '../shared/LoadMoreFooter';
import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import SearchField from '../shared/SearchField';
import Spinner from '../shared/Spinner';
import permissions from '../../lib/permissions';
import { formatNumber } from '../../lib/number';

import InvitationRow from './InvitationRow';
import Row from './Row';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';

const ORGANIZATION_ROLES = [
  { name: 'Everyone', id: null },
  { name: 'Administrators', id: OrganizationMemberRoleConstants.ADMIN },
  { name: 'Users', id: OrganizationMemberRoleConstants.MEMBER }
];

const PAGE_SIZE = 10;

class MemberIndex extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired,
        pageInfo: PropTypes.shape({
          hasNextPage: PropTypes.bool.isRequired
        }).isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }),
      invitations: PropTypes.shape({
        pageInfo: PropTypes.shape({
          hasNextPage: PropTypes.bool.isRequired
        }).isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          })
        ).isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    loadingMembers: false,
    searchingMembersIsSlow: false,
    loadingInvitations: false
  };

  componentDidMount() {
    // Use a `forceFetch` so every time the user comes back to this page we'll
    // grab fresh data.
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`Users · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="users"
                className="align-middle mr2"
                style={{ width: 40, height: 40 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Users
            </PageHeader.Title>
            <PageHeader.Description>
              Invite people to this organization so they can see and create builds, manage pipelines, and customize their notification preferences.
            </PageHeader.Description>
            <PageHeader.Menu>{this.renderNewMemberButton()}</PageHeader.Menu>
          </PageHeader>
          <Panel className="mb4">
            <div className="py2 px3">
              <div className="flex flex-auto items-center">
                <SearchField
                  className="flex-auto"
                  placeholder="Search users…"
                  searching={this.state.searchingMembersIsSlow}
                  onChange={this.handleMemberSearch}
                />

                <div className="flex-none pl3 flex">
                  <Dropdown width={150} ref={(_memberRoleDropdown) => this._memberRoleDropdown = _memberRoleDropdown}>
                    <div className="underline-dotted cursor-pointer inline-block regular dark-gray">{ORGANIZATION_ROLES.find((role) => role.id === this.props.relay.variables.memberRole).name}</div>
                    {this.renderMemberRoles()}
                  </Dropdown>
                </div>
              </div>
            </div>
            {this.renderMemberSearchInfo()}
            {this.renderMembers()}
            {this.props.relay.variables.isMounted && (
              <LoadMoreFooter
                label="Users"
                loading={this.state.loadingMembers}
                searching={this.state.searchingMembers}
                onLoadMore={this.handleLoadMoreMembers}
                connection={this.props.organization.members}
              />
            )}
          </Panel>

          {this.renderInvitationsPanel()}
        </div>
      </DocumentTitle>
    );
  }

  renderNewMemberButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "organizationInvitationCreate",
        render: () => <PageHeader.Button link={`/organizations/${this.props.organization.slug}/users/new`} theme="default" outline={true}>Invite Users</PageHeader.Button>
      }
    );
  }

  renderMemberRoles() {
    return ORGANIZATION_ROLES.map((role, index) => {
      return (
        <div key={index} className="btn block hover-bg-silver" onClick={() => { this._memberRoleDropdown.setShowing(false); this.handleMemberRoleSelect(role.id); }}>
          <span className="block">{role.name}</span>
        </div>
      );
    });
  }

  handleMemberRoleSelect = (memberRole) => {
    this.handleMemberFilterChange({ memberRole });
  };

  renderMemberSearchInfo() {
    const { organization: { members }, relay: { variables: { memberSearch } } } = this.props;

    if (memberSearch && members) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">
            {formatNumber(members.count)} matching member{members.count !== 1 && 's'}
          </small>
        </div>
      );
    }
  }

  renderMembers() {
    const { members } = this.props.organization;

    if (!members) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }

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

  handleMemberSearch = (memberSearch) => {
    this.handleMemberFilterChange({ memberSearch });
  };

  handleMemberFilterChange = (varibles) => {
    this.setState({ searchingMembers: true });

    if (this.memberSearchIsSlowTimeout) {
      clearTimeout(this.memberSearchIsSlowTimeout);
    }

    this.memberSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingMembersIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      varibles,
      (readyState) => {
        if (readyState.done) {
          if (this.memberSearchIsSlowTimeout) {
            clearTimeout(this.memberSearchIsSlowTimeout);
          }
          this.setState({
            searchingMembers: false,
            searchingMembersIsSlow: false
          });
        }
      }
    );
  };

  handleLoadMoreMembers = () => {
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

  renderInvitationsPanel() {
    if (this.props.organization.permissions.organizationInvitationCreate.allowed) {
      return (
        <Panel>
          <Panel.Header>Invitations</Panel.Header>
          {this.renderInvitations()}
          {this.renderInvitationFooter()}
        </Panel>
      );
    }
  }

  renderInvitations() {
    const invitations = this.props.organization.invitations;

    if (!invitations) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }

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
    }

    return (
      <Panel.Section>
        <div className="dark-gray">There are no pending invitations</div>
      </Panel.Section>
    );
  }

  renderInvitationFooter() {
    // don't show any footer if we haven't ever loaded
    // any invitations, or if there's no next page
    if (!this.props.organization.invitations || !this.props.organization.invitations.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreInvitationsClick}
      >
        Show more invitations…
      </Button>
    );

    // show a spinner if we're loading more invitations
    if (this.state.loadingInvitations) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleLoadMoreInvitationsClick = () => {
    this.setState({ loadingInvitations: true });

    let { invitationPageSize } = this.props.relay.variables;

    invitationPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { invitationPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loadingInvitations: false });
        }
      }
    );
  };
}

export default Relay.createContainer(MemberIndex, {
  initialVariables: {
    isMounted: false,
    memberPageSize: PAGE_SIZE,
    memberSearch: null,
    memberRole: null,
    invitationPageSize: PAGE_SIZE
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
        members(first: $memberPageSize, search: $memberSearch, role: $memberRole, order: NAME) @include(if: $isMounted) {
          ${LoadMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              ${Row.getFragment('organizationMember')}
            }
          }
        }
        invitations(first: $invitationPageSize, state: PENDING) @include(if: $isMounted) {
          edges {
            node {
              id
              ${InvitationRow.getFragment('organizationInvitation')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});
