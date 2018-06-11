// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';

import Panel from '../../shared/Panel';
import SearchField from '../../shared/SearchField';
import ShowMoreFooter from '../../shared/ShowMoreFooter';

import { formatNumber } from '../../../lib/number';

import TeamMemberUpdateMutation from '../../../mutations/TeamMemberUpdate';
import TeamMemberDeleteMutation from '../../../mutations/TeamMemberDelete';

import Chooser from './chooser';
import Row from './row';

const PAGE_SIZE = 10;

type Props = {
  team: {
    members: {
      count: number,
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  },
  className?: string,
  relay: Object
};

type State = {
  loading: boolean,
  searchingMembers: boolean,
  searchingMembersIsSlow: boolean
};

class Members extends React.PureComponent<Props, State> {
  static displayName = "Team.Members";

  static propTypes = {
    team: PropTypes.shape({
      members: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  teamSearchIsSlowTimeout: ?TimeoutID;

  state = {
    loading: false,
    searchingMembers: false,
    searchingMembersIsSlow: false
  };

  render() {
    return (
      <div>
        <Chooser
          team={this.props.team}
          onChoose={this.handleTeamMemberChoose}
        />
        <Panel className={this.props.className}>
          {this.renderMemberSearch()}
          {this.renderMemberSearchInfo()}
          {this.renderMembers()}
          <ShowMoreFooter
            connection={this.props.team.members}
            label="members"
            loading={this.state.loading}
            searching={this.state.searchingMembers}
            onShowMore={this.handleShowMoreMembers}
          />
        </Panel>
      </div>
    );
  }

  renderMembers() {
    if (this.props.team.members.edges.length > 0) {
      return this.props.team.members.edges.map((edge) => {
        return (
          <Row
            key={edge.node.id}
            teamMember={edge.node}
            onRemoveClick={this.handleTeamMemberRemove}
            onRoleChange={this.handleRoleChange}
            relay={this.props.relay}
          />
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

  handleMemberSearch = (memberSearch) => {
    this.setState({ searchingMembers: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingMembersIsSlow: true });
    }, second.bind(1));

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

  handleShowMoreMembers = () => {
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
    memberSearch: ''
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Chooser.getFragment('team')}
        members(first: $pageSize, search: $memberSearch, order: NAME) {
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              ${Row.getFragment('teamMember')}
            }
          }
        }
      }
    `
  }
});
