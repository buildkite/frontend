import React from 'react';
import PropTypes from 'prop-types';
import { createPaginationContainer, graphql } from 'react-relay';

import Panel from '../../../shared/Panel';
import ShowMoreFooter from '../../../shared/ShowMoreFooter';

import Row from './row';
import Chooser from './chooser';

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 20;

class TeamMemberships extends React.PureComponent {
  static displayName = "Member.Edit.TeamMemberships";

  static propTypes = {
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    }),
    isSelf: PropTypes.bool.isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    loading: false
  };

  render() {
    return (
      <div className="mb4">
        <div className="flex items-center">
          <h2 className="h2 flex-auto">Team Memberships</h2>
          <Chooser
            organizationMember={this.props.organizationMember}
            onChoose={this.handleTeamMemberAdd}
            isSelf={this.props.isSelf}
          />
        </div>
        <Panel>
          {this.renderTeams()}
          <ShowMoreFooter
            connection={this.props.organizationMember.teams}
            label="teams"
            loading={this.state.loading}
            onShowMore={this.handleShowMoreTeams}
          />
        </Panel>
      </div>
    );
  }

  handleTeamMemberAdd = () => {
    this.props.relay.forceFetch();
  };

  renderTeams() {
    const teams = this.props.organizationMember.teams.edges;

    if (!teams.length) {
      return (
        <Panel.Row>
          This user is not a member of any teams.
        </Panel.Row>
      );
    }

    return teams.map(({ node }) => (
      <Row
        key={node.id}
        teamMember={node}
        isSelf={this.props.isSelf}
      />
    ));
  }

  handleShowMoreTeams = () => {
    this.setState({ loading: true });

    let { teamsPageSize } = this.props.relay.variables;

    teamsPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { teamsPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };
}

export default createPaginationContainer(
  TeamMemberships,
  {
    organizationMember: graphql`
      fragment team_memberships_organizationMember on OrganizationMember {
        uuid
        user {
          id
        }
        teams(first: $count, after: $cursor, order: NAME) @connection(key: "team_memberships_teams") {
          ...show_more_footer_connection
          count
          edges {
            node {
              id
              ...row_teamMember
            }
          }
        }
        ...chooser_organizationMember
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.organizationMember && props.organizationMember.teams;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor
      };
    },
    query: graphql`
      query team_memberships_paginationQuery(
        $count: Int!
        $cursor: String
        $order: String!
      ) {
        organizationMember {
          ...team_memberships_organizationMember
        }
      }
    `
  }
);
