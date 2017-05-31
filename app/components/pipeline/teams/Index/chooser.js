import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import AutocompleteDialog from '../../../shared/Autocomplete/Dialog';
import Button from '../../../shared/Button';
import permissions from '../../../../lib/permissions';

import FlashesStore from '../../../../stores/FlashesStore';

import TeamSuggestion from '../../../team/Suggestion';

import TeamPipelineCreateMutation from '../../../../mutations/TeamPipelineCreate';

class Chooser extends React.Component {
  static displayName = "PipelineTeamIndex.Chooser";

  static propTypes = {
    pipeline: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
    removing: null,
    showingDialog: false
  };

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true
    });
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.handleDialogOpen}
          outline={true}
          theme="default"
        >
          Add Team…
        </Button>
        <AutocompleteDialog
          isOpen={this.state.showingDialog}
          onRequestClose={this.handleDialogClose}
          width={400}
          onSearch={this.handleTeamSearch}
          onSelect={this.handleTeamSelect}
          items={this.renderAutoCompleteSuggstions(this.props.relay.variables.teamAddSearch)}
          placeholder="Find a team…"
          selectLabel="Add Team"
          popover={false}
          ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
        />
      </div>
    );
  }

  renderAutoCompleteSuggstions(teamAddSearch) {
    const organizationTeams = this.props.pipeline.organization.teams;
    const pipelineTeams = this.props.pipeline.teams;

    if (!organizationTeams || !pipelineTeams) {
      return [];
    }

    // Filter team edges by permission to add them,
    // and not yet being added to this pipeline
    const relevantTeamEdges = organizationTeams.edges.filter(({ node: team }) => (
      team.permissions.teamPipelineCreate.allowed &&
      !pipelineTeams.edges.some(({ node: pipelineTeam }) => (
        pipelineTeam.team.id == team.id
      ))
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
    } else {
      return [
        <AutocompleteDialog.ErrorMessage key="error">
          Could not find any more teams to add
        </AutocompleteDialog.ErrorMessage>
      ];
    }
  }

  handleDialogOpen = () => {
    this.setState({ showingDialog: true }, () => { this._autoCompletor.focus(); });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
  };

  handleTeamSearch = (teamAddSearch) => {
    this.props.relay.setVariables({ teamAddSearch });
  };

  handleTeamSelect = (team) => {
    this.setState({ showingDialog: false });
    this._autoCompletor.clear();
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
    teamAddSearch: ''
  },

  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${TeamPipelineCreateMutation.getFragment('pipeline')}
        id
        organization {
          teams(search: $teamAddSearch, first: 10, order: RELEVANCE) @include (if: $isMounted) {
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
        teams(first: 500) @include (if: $isMounted) {
          edges {
            node {
              id
              team {
                id
              }
            }
          }
        }
      }
    `
  }
});
