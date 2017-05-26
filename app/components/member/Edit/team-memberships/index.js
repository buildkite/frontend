import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from '../../../shared/Button';
import Panel from '../../../shared/Panel';
import Spinner from '../../../shared/Spinner';

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
    isSelf: PropTypes.bool.isRequired,
    relay: PropTypes.object.isRequired
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
          {this.renderTeamsFooter()}
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
        Show more memberships…
      </Button>
    );

    // show a spinner if we're loading more teams
    if (this.state.loading) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleLoadMoreTeamsClick = () => {
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

export default Relay.createContainer(TeamMemberships, {
  initialVariables: {
    teamsPageSize: INITIAL_PAGE_SIZE
  },

  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        user {
          id
        }
        teams(first: $teamsPageSize, order: NAME) {
          count
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              ${Row.getFragment('teamMember')}
            }
          }
        }
        ${Chooser.getFragment('organizationMember')}
      }
    `
  }
});
