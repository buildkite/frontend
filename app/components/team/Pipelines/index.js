import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import FormAutoCompleteField from '../../shared/FormAutoCompleteField';

import TeamPipelineCreateMutation from '../../../mutations/TeamPipelineCreate';
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
      organization: React.PropTypes.object.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel>
        <Panel.Header>Pipelines</Panel.Header>
        <Panel.Body>
          <FormAutoCompleteField onSearch={this.handlePipelineSearch}
            onSelect={this.handlePipelineSelect}
            items={this.renderItems()}
            placeholder="Search for a pipeline to add"
            ref={c => this._autoCompletor = c} />
        </Panel.Body>
        {
          this.props.team.pipelines.edges.map((edge) => {
            return (
              <Row key={edge.node.id} pipeline={edge.node} onRemoveClick={this.handlePipelineRemove} relay={this.props.relay} />
              )
          })
        }
      </Panel>
    );
  }

  renderItems() {
    return this.props.team.organization.pipelines.edges.map((teamPipeline) => {
      return [ <Pipeline key={teamPipeline.node.id} pipeline={teamPipeline.node} />, teamPipeline.node ];
    });
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

  handlePipelineRemove = (teamPipeline) => {
    Relay.Store.commitUpdate(new TeamPipelineDeleteMutation({
      teamPipeline: teamPipeline
    }), { onFailure: this.handleMutationFailure });
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
	pipelines(first: 100) {
	  edges {
	    node {
	      id
	      pipeline {
		id
		name
		repository
	      }
              ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
	    }
	  }
	}
      }
    `
  }
});
