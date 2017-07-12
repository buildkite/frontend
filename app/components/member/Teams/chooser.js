import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import shallowCompare from 'react-addons-shallow-compare';

import AutocompleteDialog from '../../shared/Autocomplete/Dialog';
import Button from '../../shared/Button';

import FlashesStore from '../../../stores/FlashesStore';

import Team from './team';

class Chooser extends React.Component {
  static displayName = "Member.Edit.TeamMemberships.Chooser";

  static propTypes = {
    organizationMember: PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired
      }).isRequired,
      organization: PropTypes.shape({
        teams: PropTypes.shape({
          edges: PropTypes.array.isRequired
        })
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
    return (
      <div>
        <Button
          className="mb3"
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
          placeholder="Find a team…"
          selectLabel="Add Team"
          popover={false}
          ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
        />
      </div>
    );
  }

  renderAutoCompleteSuggstions(teamAddSearch) {
    const teams = this.props.organizationMember.organization.teams;

    if (!teams || this.state.loading) {
      return [ <AutocompleteDialog.Loader key="loading" /> ]
    }

    const relevantTeamEdges = teams.edges.filter(({ node }) => (
      node.permissions.teamMemberCreate.allowed
    ));

    // Either render the suggestions, or show a "not found" error
    if (relevantTeamEdges.length > 0) {
      return relevantTeamEdges.map(({ node }) => {
        return [<Team key={node.id} team={node} />, node];
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
        {`Could not find any more teams to add`}
      </AutocompleteDialog.ErrorMessage>
    ];
  }

  handleDialogOpen = () => {
    // First switch the component into a "loading" mode and refresh the data in the chooser
    this.setState({ loading: true });
    this.props.relay.forceFetch({ isMounted: true, userSelector: `!${this.props.organizationMember.user.uuid}` }, (state) => {
      if (state.done) {
        this.setState({ loading: false });
      }
    });

    // Now start showing the dialog, and when it's open, autofocus the first
    // result.
    this.setState({ showingDialog: true }, () => { this._autoCompletor.focus(); });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
    this._autoCompletor.clear();
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
    this._autoCompletor.clear();
    this.props.relay.forceFetch({ teamAddSearch: '' });

    const query = Relay.QL`mutation TeamMemberCreateMutation {
      teamMemberCreate(input: $input) {
        clientMutationId
      }
    }`;

    const variables = {
      input: {
        teamID: team.id,
        userID: this.props.organizationMember.user.id
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
    teamAddSearch: '',
    userSelector: null
  },

  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        id
        user {
          id
          uuid
        }
        organization {
          id
          teams(search: $teamAddSearch, first: 10, order: RELEVANCE, user: $userSelector) @include (if: $isMounted) {
            edges {
              node {
                id
                ${Team.getFragment('team')}
                permissions {
                  teamMemberCreate {
                    allowed
                  }
                }
              }
            }
          }
        }
      }
    `
  }
});
