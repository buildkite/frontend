import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../../../shared/Panel';
import PageHeader from '../../../shared/PageHeader';
import Button from '../../../shared/Button';
import permissions from '../../../../lib/permissions';
import PageWithContainer from '../../../shared/PageWithContainer';
import Emojify from '../../../shared/Emojify';
import FormAutoCompleteField from '../../../shared/FormAutoCompleteField';

import TeamPipelineCreateMutation from '../../../../mutations/TeamPipelineCreate';

import Row from "./row";

class Index extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
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
    params: React.PropTypes.shape({
      organization: React.PropTypes.string.isRequired,
      pipeline: React.PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.pipeline.name}`}>
        <PageWithContainer>
          <PageHeader>
            <PageHeader.Title>Teams for {this.props.pipeline.name}</PageHeader.Title>
          </PageHeader>

          <Panel>
            <Panel.Section>
              <FormAutoCompleteField onSearch={this.handleTeamSearch}
                onSelect={this.handleTeamSelect}
                items={this.renderAutoCompleteSuggestions(this.props.relay.variables.search)}
                placeholder="Add a team…"
                ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
              />
            </Panel.Section>

            {this.renderRows()}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderRows() {
    if (this.props.pipeline.teams.edges.length > 0) {
      return this.props.pipeline.teams.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamPipeline={edge.node} />
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
        return [<div key={team.id}>{team.name}</div>, team];
      });
    } else if (search !== "") {
      return [
        <FormAutoCompleteField.ErrorMessage key="error">
          Could not find a team with name <em>{search}</em>
        </FormAutoCompleteField.ErrorMessage>
      ];
    } else {
      return [];
    }
  }

  handleTeamSearch = (text) => {
    this.props.relay.setVariables({ search: text });
  };

  handleTeamSelect = (team) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ search: "" });
    this._autoCompletor.focus();

    Relay.Store.commitUpdate(new TeamPipelineCreateMutation({
      team: team,
      pipeline: this.props.pipeline
    }), { onFailure: (transaction) => alert(transaction.getError()) });
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
          teams(search: $search, first: 10) {
            edges {
              node {
                id
                name
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
