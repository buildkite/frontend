import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import shallowCompare from 'react-addons-shallow-compare';

import AutocompleteDialog from 'app/components/shared/Autocomplete/Dialog';
import Button from 'app/components/shared/Button';

import FlashesStore from 'app/stores/FlashesStore';

import TeamSuggestion from './team-suggestion';

import TeamPipelineCreateMutation from 'app/mutations/TeamPipelineCreate';

class Chooser extends React.Component {
  static displayName = "PipelineTeamIndex.Chooser";

  static propTypes = {
    pipeline: PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        teams: PropTypes.shape({
          edges: PropTypes.array.isRequired
        })
      })
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
    return (
      <div>
        <Button
          onClick={this.handleDialogOpen}
        >
          Add to Team
        </Button>
        <AutocompleteDialog
          isOpen={this.state.showingDialog}
          onRequestClose={this.handleDialogClose}
          width={400}
          onSearch={this.handleTeamSearch}
          onSelect={this.handleTeamSelect}
          items={this.renderAutoCompleteSuggstions(this.props.relay.variables.teamAddSearch)}
          placeholder="Search all teams…"
          selectLabel="Add"
          popover={false}
        />
      </div>
    );
  }

  renderAutoCompleteSuggstions(teamAddSearch) {
    const organizationTeams = this.props.pipeline.organization.teams;

    if (!organizationTeams || this.state.loading) {
      return [<AutocompleteDialog.Loader key="loading" />];
    }

    // Filter team edges by permission to add them
    const relevantTeamEdges = organizationTeams.edges.filter(({ node }) => (
      node.permissions.teamPipelineCreate.allowed
    ));

    // Either render the suggestions, or show a "not found" error
    if (relevantTeamEdges.length > 0) {
      return relevantTeamEdges.map(({ node }) => {
        return [<TeamSuggestion key={node.id} team={node} />, node];
      });
    } else if (teamAddSearch !== "") {
      return [
        <AutocompleteDialog.ErrorMessage key="error">
          Could not find a team with name <em>{teamAddSearch}</em>
        </AutocompleteDialog.ErrorMessage>
      ];
    }

    return [
      <AutocompleteDialog.ErrorMessage key="error">
        Could not find any more teams to add
      </AutocompleteDialog.ErrorMessage>
    ];
  }

  handleDialogOpen = () => {
    // First switch the component into a "loading" mode and refresh the data in the chooser
    this.setState({ loading: true });
    this.props.relay.forceFetch({ includeSearchResults: true, pipelineSelector: `!${this.props.pipeline.slug}` }, (state) => {
      if (state.done) {
        this.setState({ loading: false });
      }
    });

    // Now start showing the dialog
    this.setState({ showingDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
    this.props.relay.setVariables({ teamAddSearch: '' });
  };

  handleTeamSearch = (teamAddSearch) => {
    this.setState({ searching: true });
    this.props.relay.forceFetch(
      { teamAddSearch },
      (state) => {
        if (state.done) {
          this.setState({ searching: false });
        }
      }
    );
  };

  handleTeamSelect = (team) => {
    this.setState({ showingDialog: false });
    this.props.relay.setVariables({ teamAddSearch: '' });

    const mutation = new TeamPipelineCreateMutation({
      team: team,
      pipeline: this.props.pipeline
    });

    Relay.Store.commitUpdate(mutation, {
      onFailure: this.handleMutationFailure,
      onSuccess: this.handleMutationSuccess
    });
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
    includeSearchResults: false,
    teamAddSearch: '',
    pipelineSelector: null
  },

  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${TeamPipelineCreateMutation.getFragment('pipeline')}
        id
        slug
        organization {
          teams(search: $teamAddSearch, first: 10, order: RELEVANCE, pipeline: $pipelineSelector) @include (if: $includeSearchResults) {
            edges {
              node {
                id
                permissions {
                  teamPipelineCreate {
                    allowed
                  }
                }
                ${TeamSuggestion.getFragment('team')}
                ${TeamPipelineCreateMutation.getFragment('team')}
              }
            }
          }
        }
      }
    `
  }
});
