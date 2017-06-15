import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';

import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import Panel from '../../shared/Panel';
import SearchField from '../../shared/SearchField';
import Spinner from '../../shared/Spinner';

import { formatNumber } from '../../../lib/number';

import TeamMemberUpdateMutation from '../../../mutations/TeamMemberUpdate';
import TeamMemberDeleteMutation from '../../../mutations/TeamMemberDelete';

import Chooser from './chooser';
import Row from './row';

const PAGE_SIZE = 10;

class Members extends React.Component {
  static displayName = "Team.Members";

  static propTypes = {
    team: PropTypes.shape({
      allMembers: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired,
        pageInfo: PropTypes.shape({
          hasNextPage: PropTypes.bool.isRequired
        }).isRequired,
        edges: PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  state = {
    loading: false,
    searchingMembersIsSlow: false
  };

  render() {
    return (
      <div>
        <div className="flex items-center">
          <h2 className="h2 flex-auto">Members {this.renderMemberCount()}</h2>
          <Chooser team={this.props.team} onChoose={this.handleTeamMemberChoose} />
        </div>
        <Panel className={this.props.className}>
          {this.renderMemberSearch()}
          {this.renderMemberSearchInfo()}
          {this.renderMembers()}
          {this.renderMemberFooter()}
        </Panel>
      </div>
    );
  }

  renderMemberCount() {
    if (!this.props.team.members) {
      return;
    }

    return (
      <Badge>{formatNumber(this.props.team.allMembers.count)}</Badge>
    );
  }

  renderMembers() {
    if (this.props.team.members.edges.length > 0) {
      return this.props.team.members.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamMember={edge.node} onRemoveClick={this.handleTeamMemberRemove} onRoleChange={this.handleRoleChange} relay={this.props.relay} />
        );
      });
    }

    if (this.props.relay.variables.memberSearch) {
      return null;
    }

    return (
      <Panel.Section className="dark-gray">
        There are no users assigned to this team
      </Panel.Section>
    );
  }

  renderMemberSearch() {
    const { team: { members }, relay: { variables: { memberSearch } } } = this.props;

    if (members.edges.length > 0 || memberSearch) {
      return (
        <div className="py2 px3">
          <SearchField
            placeholder="Search members…"
            searching={this.state.searchingMembersIsSlow}
            onChange={this.handleMemberSearch}
          />
        </div>
      );
    }

    return null;
  }

  renderMemberSearchInfo() {
    const { team: { members }, relay: { variables: { memberSearch } } } = this.props;

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

  renderMemberFooter() {
    // don't show any footer if we haven't ever loaded
    // any members, or if there's no next page
    if (!this.props.team.members || !this.props.team.members.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreMembersClick}
      >
        Show more members…
      </Button>
    );

    // show a spinner if we're loading more members
    if (this.state.loading) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleMemberSearch = (memberSearch) => {
    this.setState({ searchingMembers: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingMembersIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      { memberSearch },
      (readyState) => {
        if (readyState.done) {
          if (this.teamSearchIsSlowTimeout) {
            clearTimeout(this.teamSearchIsSlowTimeout);
          }
          this.setState({
            searchingMembers: false,
            searchingMembersIsSlow: false
          });
        }
      }
    );
  };

  handleLoadMoreMembersClick = () => {
    this.setState({ loading: true });

    let { pageSize } = this.props.relay.variables;

    pageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { pageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };

  handleTeamMemberChoose = () => {
    this.props.relay.forceFetch();
  };

  handleUserSearch = (memberAddSearch) => {
    this.props.relay.setVariables({ memberAddSearch });
  };

  handleTeamMemberRemove = (teamMember, callback) => {
    Relay.Store.commitUpdate(new TeamMemberDeleteMutation({
      teamMember: teamMember
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleRoleChange = (teamMember, role, callback) => {
    Relay.Store.commitUpdate(new TeamMemberUpdateMutation({
      teamMember: teamMember,
      role: role
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };
}

export default Relay.createContainer(Members, {
  initialVariables: {
    isMounted: false,
    memberAddSearch: '',
    teamSelector: null,
    pageSize: PAGE_SIZE,
    memberSearch: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Chooser.getFragment('team')}

        allMembers: members {
          count
        }

        members(first: $pageSize, search: $memberSearch, order: NAME) {
          count
          edges {
            node {
              id
              role
              user {
                id
                name
                email
                avatar {
                  url
                }
              }
              permissions {
                teamMemberUpdate {
                  allowed
                }
                teamMemberDelete {
                  allowed
                }
              }
              ${TeamMemberDeleteMutation.getFragment('teamMember')}
              ${TeamMemberUpdateMutation.getFragment('teamMember')}
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
