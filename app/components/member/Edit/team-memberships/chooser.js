import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import AutocompleteDialog from '../../../shared/Autocomplete/Dialog';
import Button from '../../../shared/Button';
import Emojify from '../../../shared/Emojify';

import FlashesStore from '../../../../stores/FlashesStore';

const PAGE_SIZE = 10;

class Chooser extends React.Component {
  static displayName = "Member.Edit.TeamMemberships.Chooser";

  static propTypes = {
    organizationMember: PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired,
      organization: PropTypes.shape({
        teams: PropTypes.array
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired,
    onChoose: PropTypes.func.isRequired,
    isSelf: PropTypes.bool.isRequired
  };

  state = {
    showingDialog: false,
    relevantTeams: [],
    canAddToAny: false
  };

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true
    });
  }

  componentWillReceiveProps(nextProps) {
    const teams = nextProps.organizationMember.organization.teams;

    // If we don't get given teams, we haven't sent the query yet,
    // so we don't know!
    if (!teams) {
      return;
    }

    const newState = {};

    // NOTE: This is a bit of a hack to work around the fact that
    // permissions exist on a per-team level, not at the
    // organizationMember or organization level!
    newState.relevantTeams = teams.edges.filter(({ node }) => (
      node.permissions.teamMemberCreate.allowed
    ));

    if (!this.props.relay.variables.teamAddSearch) {
      if (newState.relevantTeams.length > 0) {
        newState.canAddToAny = true;
      }
    }

    this.setState(newState);
  }

  render() {
    // Only show the button once we've got the first team request,
    // and discovered that there are one or more teams to which
    // the current user can add members
    if (!this.state.canAddToAny) {
      return null;
    }

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
    if (!this.props.organizationMember.organization.teams) {
      return [];
    }

    // Either render the suggestions, or show a "not found" error
    if (this.state.relevantTeams.length > 0) {
      return this.state.relevantTeams.map(({ node }) => {
        return [
          <div key={node.id}>
            <Emojify className="semi-bold truncate block" text={node.name} />
            <div className="m0 p0 dark-gray truncate"><Emojify text={node.description || "n/a"} /></div>
          </div>,
          node
        ];
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
          Could not find any more teams
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
    pageSize: PAGE_SIZE
  },

  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        id
        user {
          id
        }
        organization {
          teams(search: $teamAddSearch, first: 10, order: RELEVANCE) @include (if: $isMounted) {
            edges {
              node {
                id
                name
                description
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
