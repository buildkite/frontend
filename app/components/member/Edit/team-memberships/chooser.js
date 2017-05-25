import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import AutocompleteDialog from '../../../shared/Autocomplete/Dialog';
import Button from '../../../shared/Button';

import FlashesStore from '../../../../stores/FlashesStore';

import Team from './team';

const PAGE_SIZE = 10;

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
    onChoose: PropTypes.func.isRequired,
    isSelf: PropTypes.bool.isRequired
  };

  state = {
    showingDialog: false,
    searching: false
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
          outline={true}
          theme="default"
        >
          {`${this.props.isSelf ? 'Join a' : 'Add to'} Team…`}
        </Button>
        <AutocompleteDialog
          isOpen={this.state.showingDialog}
          onRequestClose={this.handleDialogClose}
          width={400}
          onSearch={this.handleTeamSearch}
          onSelect={this.handleTeamSelect}
          items={this.renderAutoCompleteSuggstions(this.props.relay.variables.teamAddSearch)}
          placeholder="Find a team…"
          selectLabel={`${this.props.isSelf ? 'Join' : 'Add to'} Team`}
          popover={false}
          ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
        />
      </div>
    );
  }

  renderAutoCompleteSuggstions(teamAddSearch) {
    const teams = this.props.organizationMember.organization.teams;

    if (!teams) {
      return [];
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
    } else {
      return [
        <AutocompleteDialog.ErrorMessage key="error">
          {`Could not find any more teams ${this.props.isSelf ? 'to join' : 'to add'}`}
        </AutocompleteDialog.ErrorMessage>
      ];
    }
  }

  handleDialogOpen = () => {
    // Fetch the teams list on first open by setting (if: $showingDialog) to true
    // and force re-fetch on subsequent opens in case the teams list has changed
    this.props.relay.forceFetch({
      showingDialog: true,
      userSelector: `!${this.props.organizationMember.user.uuid}`
    }, (state) => {
      // When we're finished re-fetching, show the dialog
      if (state.done) {
        this.setState({
          showingDialog: true
        }, () => {
          this._autoCompletor.focus();
        });
      }
    });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
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
    showingDialog: false,
    teamAddSearch: '',
    userSelector: null,
    pageSize: PAGE_SIZE
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
          teams(search: $teamAddSearch, first: 10, order: RELEVANCE, user: $userSelector) @include (if: $showingDialog) {
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
