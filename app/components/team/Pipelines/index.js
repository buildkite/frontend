import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import FormAutoCompleteField from '../../shared/FormAutoCompleteField';
import GraphQLErrors from '../../../constants/GraphQLErrors';

import Row from './row';
import Pipeline from './pipeline';

class Pipelines extends React.Component {
  static displayName = "Team.Pipelines";

  static propTypes = {
    team: React.PropTypes.shape({
    }).isRequired
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel>
	<Panel.Header>Projects</Panel.Header>
	<Panel.Body>
	  <FormAutoCompleteField onSearch={this.handlePipelineSearch}
	    onSelect={this.handlePipelineSelect}
	    items={this.renderItems()}
	    placeholder="Search for a project to add"
	    ref="input" />
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
      return [ <Pipeline pipeline={teamPipeline.node} />, teamPipeline.node ];
    });
  };

  handlePipelineSearch = (text) => {
    this.props.relay.setVariables({ search: text });
  };

  handlePipelineSelect = (pipeline) => {
    this.refs.input.clear();
    this.props.relay.setVariables({ search: "" });
    this.refs.input.focus();

    Relay.Store.update(new TeamAddPipelineMutation({
      team: this.props.team,
      pipeline: pipeline
    }), { onFailure: this.handleMutationFailure });
  };

  handlePipelineRemove = (e) => {
    // todo
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
	organization {
	  pipelines(search: $search, first: 10) {
	    edges {
	      node {
		id
		name
		repository
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
	    }
	  }
	}
      }
    `
  }
});
