import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import AutocompleteField from '../../shared/AutocompleteField';
import permissions from '../../../lib/permissions';

import FlashesStore from '../../../stores/FlashesStore';

import TeamPipelineCreateMutation from '../../../mutations/TeamPipelineCreate';
import TeamPipelineUpdateMutation from '../../../mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from '../../../mutations/TeamPipelineDelete';

import Row from './row';
import Pipeline from './pipeline';

const PAGE_SIZE = 10;

class Pipelines extends React.Component {
  static displayName = "Team.Pipelines";

  static propTypes = {
    team: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
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

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true,
      teamSelector: `!${this.props.team.slug}`
    });
  }

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
            <AutocompleteField
              onSearch={this.handlePipelineSearch}
              onSelect={this.handlePipelineSelect}
              items={this.renderAutoCompleteSuggstions(this.props.relay.variables.pipelineAddSearch)}
              placeholder="Add pipeline…"
              ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
            />
          </Panel.Section>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(pipelineAddSearch) {
    if (!this.props.team.organization.pipelines) {
      return [];
    }

    // Either render the sugggestions, or show a "not found" error
    if (this.props.team.organization.pipelines.edges.length > 0) {
      return this.props.team.organization.pipelines.edges.map(({ node }) => {
        return [<Pipeline key={node.id} pipeline={node} />, node];
      });
    } else if (pipelineAddSearch !== "") {
      return [<AutocompleteField.ErrorMessage key={"error"}>Could not find a pipeline with name <em>{pipelineAddSearch}</em></AutocompleteField.ErrorMessage>];
    } else {
      return [];
    }
  }

  handlePipelineSearch = (pipelineAddSearch) => {
    this.props.relay.setVariables({ pipelineAddSearch });
  };

  handlePipelineSelect = (pipeline) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ pipelineAddSearch: '' });
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
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Pipelines, {
  initialVariables: {
    isMounted: false,
    pipelineAddSearch: '',
    teamSelector: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        slug
        ${TeamPipelineCreateMutation.getFragment('team')}

        organization {
          pipelines(search: $pipelineAddSearch, first: 10, order: RELEVANCE, team: $teamSelector) @include (if: $isMounted) {
            edges {
              node {
                id
                name
                repository {
                  url
                }
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

        pipelines(first: $pageSize, order: NAME) {
          edges {
            node {
              id
              accessLevel
              pipeline {
                id
                name
                repository {
                  url
                }
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
