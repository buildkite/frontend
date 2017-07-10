import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';

import FormInputLabel from '../../shared/FormInputLabel';
import FormInputHelp from '../../shared/FormInputHelp';

import MemberTeamRow from '../../member/MemberTeamRow';

class PipelineNewTeams extends React.Component {
  state = {
    teams: []
  };

  constructor(initialProps) {
    super(initialProps);

    // Super hacky way of pre-populating the state from the browser. When the
    // New Pipeline form becomes 100% Relay, we can ditch. But for now, we need
    // this bridge in here so we can preselect teams when we load the page.
    if (window._pipelineNewTeamsState) {
      this.state = window._pipelineNewTeamsState;
    }
  }

  render() {
    // Collect all the teams that we're allowed to see pipelines on
    let teams = [];
    for (const edge of this.props.organization.teams.edges) {
      if (edge.node.permissions.pipelineView.allowed) {
        teams.push(edge.node);
      }
    }

    // If there aren't any teams don't bother rendering anything!
    if (teams.length === 0) {
      return null;
    }

    return (
      <div>
        {this.state.teams.map((uuid) => <input key={uuid} type="hidden" name="project[team_ids][]" value={uuid} />)}
        <FormInputLabel label="Teams" />
        <FormInputHelp html="The teams who will be given access this pipeline." />
        <div className="flex flex-wrap content-around mxn1 mt1">
          {teams.map((team) => (
            <MemberTeamRow
              key={team.uuid}
              team={team}
              checked={this.state.teams.includes(team.uuid)}
              onChange={this.handleTeamChange}
            />
          ))}
        </div>
      </div>
    );
  }

  handleTeamChange = (team) => {
    let teams;
    const teamIndex = this.state.teams.indexOf(team.uuid);

    if (teamIndex === -1) {
      // adding
      teams = this.state.teams.concat([team.uuid]);
    } else {
      // removing
      teams = this.state.teams.concat();
      teams.splice(teamIndex, 1);
    }

    this.setState({ teams });
  };
}

export default createFragmentContainer(PipelineNewTeams, {
  organization: graphql`
    fragment PipelineNewTeams_organization on Organization {
      teams(first: 50) {
        edges {
          node {
            ...MemberTeamRow_team
            uuid
            permissions {
              pipelineView {
                allowed
              }
            }
          }
        }
      }
    }
  `
});
