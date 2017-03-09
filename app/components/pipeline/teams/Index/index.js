import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../../../shared/Panel';
import Emojify from '../../../shared/Emojify';
import AutocompleteField from '../../../shared/AutocompleteField';

import FlashesStore from '../../../../stores/FlashesStore';

import TeamPipelineCreateMutation from '../../../../mutations/TeamPipelineCreate';

import Row from "./row";
import Suggestion from "./suggestion";

class Index extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        teams: React.PropTypes.shape({
          edges: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              node: React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
                description: React.PropTypes.string,
                // The slug is required since this is the object we use in the
                // optimistic response of the mutation, and when we render the
                // team row we need it's slug to link it
                slug: React.PropTypes.string
              }).isRequired
            }).isRequired
          )
        })
      }),
      teams: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.pipeline.name}`}>
        <Panel>
          <Panel.Header>Teams</Panel.Header>

          <Panel.Section>
            <AutocompleteField onSearch={this.handleTeamSearch}
              onSelect={this.handleTeamSelect}
              items={this.renderAutoCompleteSuggestions(this.props.relay.variables.search)}
              placeholder="Add a team…"
              ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
            />
          </Panel.Section>

          {this.renderRows()}
        </Panel>
      </DocumentTitle>
    );
  }

  renderRows() {
    if (this.props.pipeline.teams.edges.length > 0) {
      return this.props.pipeline.teams.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamPipeline={edge.node} organization={this.props.pipeline.organization} />
        );
      });
    } else {
      return (
        <Panel.Row>
          <div className="dark-gray py2 center"><Emojify text="This Pipeline has not been added to any teams yet" /></div>
        </Panel.Row>
      );
    }
  }

  renderAutoCompleteSuggestions(search) {
    // First filter out any teams that are already in this list
    const suggestions = [];
    this.props.pipeline.organization.teams.edges.forEach((teamEdge) => {
      let found = false;
      this.props.pipeline.teams.edges.forEach((teamPipelineEdge) => {
        if (teamPipelineEdge.node.team.id === teamEdge.node.id) {
          found = true;
        }
      });

      if (!found) {
        suggestions.push(teamEdge.node);
      }
    });

    // Either render the sugggestions, or show a "not found" error
    if (suggestions.length > 0) {
      return suggestions.map((team) => {
        return [<Suggestion key={team.id} team={team} />, team];
      });
    } else if (search !== "") {
      return [
        <AutocompleteField.ErrorMessage key="error">
          Could not find a team with name <em>{search}</em>
        </AutocompleteField.ErrorMessage>
      ];
    } else {
      return [];
    }
  }

  handleTeamSearch = (text) => {
    // As a user types into the autocompletor field, perform a teams search
    this.props.relay.setVariables({ search: text });
  };

  handleTeamSelect = (team) => {
    // Reset the autocompletor and re-focus it
    this._autoCompletor.clear();
    this.props.relay.setVariables({ search: "" });
    this._autoCompletor.focus();

    // Create our mutation that will add the pipeline to the team
    const mutation = new TeamPipelineCreateMutation({
      team: team,
      pipeline: this.props.pipeline
    });

    Relay.Store.commitUpdate(mutation, {
      onFailure: (transaction) => {
        // Show the error as a flash
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());

        // Reload the entire list to reflect any changes from the server
        this.props.relay.forceFetch();
      }
    });
  };
}

export default Relay.createContainer(Index, {
  initialVariables: {
    search: ""
  },

  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${TeamPipelineCreateMutation.getFragment('pipeline')}
        name
        organization {
          ${Row.getFragment("organization")}
          teams(search: $search, first: 10) {
            edges {
              node {
                id
                name
                description
                slug
                ${TeamPipelineCreateMutation.getFragment('team')}
              }
            }
          }
        }
        teams(first: 500) {
          edges {
            node {
              id
              team {
                id
              }
              ${Row.getFragment("teamPipeline")}
            }
          }
        }
      }
    `
  }
});
