// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';
import DocumentTitle from 'react-document-title';

import Dropdown from 'app/components/shared/Dropdown';
import Icon from 'app/components/shared/Icon';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';
import PageHeader from 'app/components/shared/PageHeader';
import Panel from 'app/components/shared/Panel';
import SearchField from 'app/components/shared/SearchField';
import Spinner from 'app/components/shared/Spinner';
import permissions from 'app/lib/permissions';
import { formatNumber } from 'app/lib/number';
import OrganizationMemberRoleConstants from 'app/constants/OrganizationMemberRoleConstants';
import InvitationRow from './InvitationRow';
import Row from './Row';

const ORGANIZATION_ROLES = [
  { name: 'Everyone', id: null },
  { name: 'Administrators', id: OrganizationMemberRoleConstants.ADMIN },
  { name: 'Users', id: OrganizationMemberRoleConstants.MEMBER }
];

const PAGE_SIZE = 10;

type Props = {
  organization: {
    name: string,
    slug: string,
    permissions: Object,
    members?: {
      count: number,
      edges: Array<{
        node: {
          id: string
        }
      }>
    },
    invitations?: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  },
  relay: Object
};

type State = {
  loadingMembers: boolean,
  searchingMembers: boolean,
  searchingMembersIsSlow: boolean,
  loadingInvitations: boolean
};

class MemberIndex extends React.PureComponent<Props, State> {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }),
      invitations: PropTypes.shape({
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
    searchingMembers: false,
    searchingMembersIsSlow: false,
    loadingInvitations: false
  };

  _memberRoleDropdown: ?Dropdown;
  memberSearchIsSlowTimeout: ?TimeoutID;

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
                    {this.renderSelectedRole()}
                    {this.renderMemberRoles()}
                  </Dropdown>
                </div>
              </div>
            </div>
            {this.renderMemberSearchInfo()}
            {this.renderMembers()}
            <ShowMoreFooter
              connection={this.props.organization.members}
              label="users"
              loading={this.state.loadingMembers}
              searching={this.state.searchingMembers}
              onShowMore={this.handleShowMoreMembers}
            />
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

  renderSelectedRole() {
    const selectedRole = ORGANIZATION_ROLES.find((role) => (
      role.id === this.props.relay.variables.memberRole
    ));

    return (
      <div className="underline-dotted cursor-pointer inline-block regular dark-gray">
        {selectedRole && selectedRole.name}
      </div>
    );
  }

  renderMemberRoles() {
    return ORGANIZATION_ROLES.map((role) => {
      return (
        <div
          key={role.id}
          className="btn block hover-bg-silver"
          onClick={() => {
            this._memberRoleDropdown && this._memberRoleDropdown.setShowing(false);
            this.handleMemberRoleSelect(role.id);
          }}
        >
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
    }, second.bind(1));

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

  handleShowMoreMembers = () => {
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
          <ShowMoreFooter
            connection={this.props.organization.invitations}
            label="invitations"
            loading={this.state.loadingInvitations}
            onShowMore={this.handleShowMoreInvitations}
          />
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

  handleShowMoreInvitations = () => {
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
    memberSearch: '',
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
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              ${Row.getFragment('organizationMember')}
            }
          }
        }
        invitations(first: $invitationPageSize, state: PENDING) @include(if: $isMounted) {
          ${ShowMoreFooter.getFragment('connection')}
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
