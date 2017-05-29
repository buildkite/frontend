import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import AutocompleteField from '../../../shared/Autocomplete/Field';
import Emojify from '../../../shared/Emojify';
import Icon from '../../../shared/Icon';
import PageHeader from '../../../shared/PageHeader';
import Panel from '../../../shared/Panel';

import FlashesStore from '../../../../stores/FlashesStore';

import TeamPipelineCreateMutation from '../../../../mutations/TeamPipelineCreate';

import Row from './row';
import TeamSuggestion from '../../../team/Suggestion';

class Index extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        teams: PropTypes.shape({
          edges: PropTypes.arrayOf(
            PropTypes.shape({
              node: PropTypes.shape({
                id: PropTypes.string.isRequired
              }).isRequired
            }).isRequired
          )
        })
      }),
      teams: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.pipeline.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="teams"
                className="align-middle mr2"
                style={{ height: 40, width: 40 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>Teams</PageHeader.Title>
            <PageHeader.Description>Teams allow you to control who has access to this pipeline</PageHeader.Description>
          </PageHeader>
          <Panel>
            <div className="py2 px3">
              <AutocompleteField
                onSearch={this.handleTeamSearch}
                onSelect={this.handleTeamSelect}
                items={this.renderAutoCompleteSuggestions(this.props.relay.variables.search)}
                placeholder="Add a team…"
                ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
              />
            </div>

            {this.renderRows()}
          </Panel>
        </div>
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
    }

    return (
      <Panel.Row>
        <div className="dark-gray py2 center">
          <Emojify text="This Pipeline has not been added to any teams yet" />
        </div>
      </Panel.Row>
    );
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

    // Either render the suggestions, or show a "not found" error
    if (suggestions.length > 0) {
      return suggestions.map((team) => {
        return [<TeamSuggestion key={team.id} team={team} />, team];
      });
    } else if (search !== "") {
      return [
        <AutocompleteField.ErrorMessage key="error">
          Could not find a team with name <em>{search}</em>
        </AutocompleteField.ErrorMessage>
      ];
    }

    return [];
  }

  handleTeamSearch = (text) => {
    // As a user types into the autocompletor field, perform a teams search
    this.props.relay.setVariables({ search: text });
  };

  handleTeamSelect = (team) => {
    // Reset the autocompletor and re-focus it
    this._autoCompletor.clear();
    this.props.relay.setVariables({ search: '' });
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
    search: ''
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
                slug
                ${TeamSuggestion.getFragment('team')}
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
