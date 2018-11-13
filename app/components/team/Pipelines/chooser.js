import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import shallowCompare from 'react-addons-shallow-compare';

import AutocompleteDialog from 'app/components/shared/Autocomplete/Dialog';
import Button from 'app/components/shared/Button';
import Emojify from 'app/components/shared/Emojify';
import permissions from 'app/lib/permissions';

import FlashesStore from 'app/stores/FlashesStore';

class Chooser extends React.Component {
  static displayName = "Team.Pipelines.Chooser";

  static propTypes = {
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        pipelines: PropTypes.shape({
          edges: PropTypes.arrayOf(
            PropTypes.shape({
              node: PropTypes.shape({
                pipeline: PropTypes.shape({
                  name: PropTypes.string.isRequired,
                  repository: PropTypes.shape({
                    url: PropTypes.string.isRequired
                  }).isRequired
                }).isRequired
              }).isRequired
            }).isRequired
          )
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
    searching: false,
    removing: null,
    showingDialog: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    // Only update when a forceFetch isn't pending, and we also meet the usual
    // requirements to update. This avoids any re-use of old cached Team data.
    return !nextState.searching && shallowCompare(this, nextProps, nextState);
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
              placeholder="Search all pipelines…"
              selectLabel="Add"
              popover={false}
            />
          </div>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(pipelineAddSearch) {
    if (!this.props.team.organization.pipelines || this.state.loading) {
      return [<AutocompleteDialog.Loader key="loading" />];
    }

    // Either render the sugggestions, or show a "not found" error
    if (this.props.team.organization.pipelines.edges.length > 0) {
      return this.props.team.organization.pipelines.edges.map(({ node }) => {
        return [
          <div key={node.id}>
            <strong className="truncate semi-bold block" title={node.name}>
              <Emojify text={node.name} />
            </strong>
            <small className="truncate dark-gray block" title={node.repository.url}>{node.repository.url}</small>
          </div>,
          node
        ];
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
    // First switch the component into a "loading" mode and refresh the data in the chooser
    this.setState({ loading: true });
    this.props.relay.forceFetch({ includeSearchResults: true, teamSelector: `!${this.props.team.slug}` }, (state) => {
      if (state.done) {
        this.setState({ loading: false });
      }
    });

    // Now start showing the dialog
    this.setState({ showingDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
    this.props.relay.setVariables({ pipelineAddSearch: '' });
  };

  handlePipelineSearch = (pipelineAddSearch) => {
    this.setState({ searching: true });
    this.props.relay.forceFetch(
      { pipelineAddSearch },
      (state) => {
        if (state.done) {
          this.setState({ searching: false });
        }
      }
    );
  };

  handlePipelineSelect = (pipeline) => {
    this.setState({ showingDialog: false });
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
    includeSearchResults: false,
    pipelineAddSearch: '',
    teamSelector: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        slug

        organization {
          pipelines(search: $pipelineAddSearch, first: 10, order: RELEVANCE, team: $teamSelector) @include (if: $includeSearchResults) {
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
