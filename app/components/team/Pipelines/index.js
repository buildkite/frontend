import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import FormAutoCompleteField from '../../shared/FormAutoCompleteField';
import permissions from '../../../lib/permissions';

import TeamPipelineCreateMutation from '../../../mutations/TeamPipelineCreate';
import TeamPipelineUpdateMutation from '../../../mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from '../../../mutations/TeamPipelineDelete';

import Row from './row';
import Pipeline from './pipeline';

class Pipelines extends React.Component {
  static displayName = "Team.Pipelines";

  static propTypes = {
    team: React.PropTypes.shape({
      pipelines: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      }).isRequired,
      organization: React.PropTypes.object.isRequired,
      permissions: React.PropTypes.shape({
        teamPipelineCreate: React.PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel className={this.props.className}>
        <Panel.Header>Pipelines</Panel.Header>
        {this.renderAutoComplete()}
        {this.renderPipelines()}
      </Panel>
    );
  }

  renderPipelines() {
    if (this.props.team.pipelines.edges.length > 0) {
      return this.props.team.pipelines.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamPipeline={edge.node} onRemoveClick={this.handleTeamPipelineRemove} onAccessLevelChange={this.handleAccessLevelChange} relay={this.props.relay} />
        );
      });
    } else {
      return <Panel.Section className="dark-gray">There are no pipelines assigned to this team</Panel.Section>;
    }
  }

  renderAutoComplete() {
    return permissions(this.props.team.permissions).check(
      {
        allowed: "teamPipelineCreate",
        render: () => (
          <Panel.Section>
            <FormAutoCompleteField onSearch={this.handlePipelineSearch}
              onSelect={this.handlePipelineSelect}
              items={this.renderAutoCompleteSuggstions(this.props.relay.variables.search)}
              placeholder="Add pipeline…"
              ref={(c) => this._autoCompletor = c}
            />
          </Panel.Section>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(search) {
    // First filter out any pipelines that are already in this list
    const suggestions = [];
    this.props.team.organization.pipelines.edges.forEach((pipeline) => {
      let found = false;
      this.props.team.pipelines.edges.forEach((edge) => {
        if (edge.node.pipeline.id === pipeline.node.id) {
          found = true;
        }
      });

      if (!found) {
        suggestions.push(pipeline.node);
      }
    });

    // Either render the sugggestions, or show a "not found" error
    if (suggestions.length > 0) {
      return suggestions.map((pipeline) => {
        return [<Pipeline key={pipeline.id} pipeline={pipeline} />, pipeline];
      });
    } else if (search !== "") {
      return [<FormAutoCompleteField.ErrorMessage key={"error"}>Could not find a pipeline with name <em>{search}</em></FormAutoCompleteField.ErrorMessage>];
    } else {
      return [];
    }
  }

  handlePipelineSearch = (text) => {
    this.props.relay.setVariables({ search: text });
  };

  handlePipelineSelect = (pipeline) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ search: "" });
    this._autoCompletor.focus();

    Relay.Store.commitUpdate(new TeamPipelineCreateMutation({
      team: this.props.team,
      pipeline: pipeline
    }), { onFailure: this.handleMutationFailure });
  };

  handleAccessLevelChange = (teamPipeline, accessLevel, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineUpdateMutation({
      teamPipeline: teamPipeline,
      accessLevel: accessLevel
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleTeamPipelineRemove = (teamPipeline, force, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineDeleteMutation({
      teamPipeline: teamPipeline,
      force: force
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleMutationFailure = (transaction) => {
    alert(transaction.getError());
  };
}

export default Relay.createContainer(Pipelines, {
  initialVariables: {
    search: ""
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${TeamPipelineCreateMutation.getFragment('team')}

        organization {
          pipelines(search: $search, first: 10) {
            edges {
              node {
                id
                name
                repository
                ${TeamPipelineCreateMutation.getFragment('pipeline')}
              }
            }
          }
        }

        permissions {
          teamPipelineCreate {
            allowed
          }
        }

        pipelines(first: 100) {
          edges {
            node {
              id
              accessLevel
              pipeline {
                id
                name
                repository
              }
              permissions {
                teamPipelineUpdate {
                  allowed
                }
                teamPipelineDelete {
                  allowed
                }
              }
              ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
              ${TeamPipelineUpdateMutation.getFragment('teamPipeline')}
            }
          }
        }
      }
    `
  }
});
