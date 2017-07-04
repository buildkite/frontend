import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import AutocompleteDialog from '../../shared/Autocomplete/Dialog';
import Button from '../../shared/Button';
import permissions from '../../../lib/permissions';

import FlashesStore from '../../../stores/FlashesStore';

import Pipeline from './pipeline';

class Chooser extends React.Component {
  static displayName = "Team.Pipelines.Chooser";

  static propTypes = {
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        pipelines: PropTypes.shape({
          edges: PropTypes.array.isRequired
        })
      }),
      permissions: PropTypes.shape({
        teamPipelineCreate: PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired,
    onChoose: PropTypes.func.isRequired
  };

  state = {
    loading: false,
    removing: null,
    showingDialog: false
  };

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true,
      teamSelector: `!${this.props.team.slug}`
    });
  }

  render() {
    return permissions(this.props.team.permissions).check(
      {
        allowed: "teamPipelineCreate",
        render: () => (
          <div>
            <Button
              className="mb3"
              onClick={this.handleDialogOpen}
            >
              Add Pipeline
            </Button>
            <AutocompleteDialog
              isOpen={this.state.showingDialog}
              onRequestClose={this.handleDialogClose}
              width={400}
              onSearch={this.handlePipelineSearch}
              onSelect={this.handlePipelineSelect}
              items={this.renderAutoCompleteSuggstions(this.props.relay.variables.pipelineAddSearch)}
              placeholder="Find a pipeline…"
              selectLabel="Add Pipeline"
              popover={false}
              ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
            />
          </div>
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
      return [
        <AutocompleteDialog.ErrorMessage key={"error"}>
          Could not find a pipeline with name <em>{pipelineAddSearch}</em>
        </AutocompleteDialog.ErrorMessage>
      ];
    }
    return [
      <AutocompleteDialog.ErrorMessage key={"error"}>
        Could not find any more pipelines to add
      </AutocompleteDialog.ErrorMessage>
    ];
  }

  handleDialogOpen = () => {
    this.setState({ showingDialog: true }, () => { this._autoCompletor.focus(); });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
  };

  handlePipelineSearch = (pipelineAddSearch) => {
    this.props.relay.setVariables({ pipelineAddSearch });
  };

  handlePipelineSelect = (pipeline) => {
    this.setState({ showingDialog: false });
    this._autoCompletor.clear();
    this.props.relay.setVariables({ pipelineAddSearch: '' });

    const query = Relay.QL`mutation TeamPipelineCreateMutation {
      teamPipelineCreate(input: $input) {
        clientMutationId
      }
    }`;

    const variables = {
      input: {
        teamID: this.props.team.id,
        pipelineID: pipeline.id
      }
    };

    const mutation = new Relay.GraphQLMutation(query, variables, null, Relay.Store, {
      onFailure: this.handleMutationFailure,
      onSuccess: this.handleMutationSuccess
    });

    mutation.commit();
  };

  handleMutationSuccess = () => {
    this.props.onChoose();
  };

  handleMutationFailure = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Chooser, {
  initialVariables: {
    isMounted: false,
    pipelineAddSearch: '',
    teamSelector: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        slug

        organization {
          pipelines(search: $pipelineAddSearch, first: 10, order: RELEVANCE, team: $teamSelector) @include (if: $isMounted) {
            edges {
              node {
                id
                name
                repository {
                  url
                }
              }
            }
          }
        }

        permissions {
          teamPipelineCreate {
            allowed
          }
        }
      }
    `
  }
});
