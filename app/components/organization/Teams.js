// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Dropdown from 'app/components/shared/Dropdown';
import Chooser from 'app/components/shared/Chooser';
import Emojify from 'app/components/shared/Emojify';
import Icon from 'app/components/shared/Icon';
import type { Teams_organization } from './__generated__/Teams_organization.graphql';

type Props = {
  selected: string,
  organization: Teams_organization,
  onTeamChange: (teamSlug: string) => void
};

class Teams extends React.Component<Props> {
  dropdownNode: ?Dropdown;

  get teamEdges() {
    if (this.props.organization.teams && this.props.organization.teams.edges) {
      return this.props.organization.teams.edges;
    }
    return [];
  }

  render() {
    // Collect all the teams that we're allowed to see pipelines on
    const teams = this.teamEdges.reduce((teams, teamEdge) => (
      teamEdge &&
      teamEdge.node &&
      teamEdge.node.permissions &&
      teamEdge.node.permissions.pipelineView &&
      teamEdge.node.permissions.pipelineView.allowed ? (
          teams.concat(teamEdge.node)
        ) : (
          teams
        )
    ), []);


    // Don't render the select if there aren't any teams that can be viewed
    if (teams.length === 0) {
      return null;
    }

    return (
      <Dropdown className="ml4" width={300} ref={(dropdownNode) => this.dropdownNode = dropdownNode}>
        <button className="h3 px0 py1 m0 light dark-gray inline-block btn" style={{ fontSize: 16 }}>
          <div className="flex">
            <span className="flex items-center">
              <span className="truncate">
                {this.renderLabel()}
              </span>
            </span>
            <span className="flex items-center">
              <Icon icon="down-triangle" style={{ width: 8, height: 8, marginLeft: '.5em' }} />
            </span>
          </div>
        </button>

        <Chooser selected={null} onSelect={this.handleDropdownSelect}>
          {this.renderOptions(teams)}
          <Chooser.Option value="" className="btn block hover-bg-silver">
            <div>All teams</div>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderLabel() {
    if (this.props.selected) {
      const selectedTeam = this.teamEdges.filter(Boolean).find(({ node }) => node && node.slug === this.props.selected);
      if (selectedTeam && selectedTeam.node) {
        return <Emojify className="block" text={selectedTeam.node.name} />;
      }
    }
    return "All teams";
  }

  renderOptions(teams) {
    return teams.map((team) =>
      (<Chooser.Option key={team.id} value={team.slug} className="btn block hover-bg-silver line-height-3">
        <Emojify className="block" text={team.name} />
        {team.description && <Emojify className="block dark-gray regular h5 mt1" text={team.description} />}
      </Chooser.Option>)
    );
  }

  handleDropdownSelect = (slug: string) => {
    if (this.dropdownNode) {
      this.dropdownNode.setShowing(false);
      this.props.onTeamChange(slug);
    }
  };
}

export default createFragmentContainer(Teams, graphql`
  fragment Teams_organization on Organization {
    teams(first: 100) {
      edges {
        node {
          id
          name
          slug
          description
          permissions {
            pipelineView {
              allowed
            }
          }
        }
      }
    }
  }
`);
