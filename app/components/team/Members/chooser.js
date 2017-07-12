import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import shallowCompare from 'react-addons-shallow-compare';

import AutocompleteDialog from '../../shared/Autocomplete/Dialog';
import Button from '../../shared/Button';
import permissions from '../../../lib/permissions';

import FlashesStore from '../../../stores/FlashesStore';

import User from './user';

class Chooser extends React.Component {
  static displayName = "Team.Members.Chooser";

  static propTypes = {
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        members: PropTypes.shape({
          edges: PropTypes.array.isRequired
        })
      }),
      permissions: PropTypes.shape({
        teamMemberCreate: PropTypes.object.isRequired
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
        allowed: "teamMemberCreate",
        render: () => (
          <div>
            <Button
              className="mb3"
              onClick={this.handleDialogOpen}
            >
              Add Member
            </Button>
            <AutocompleteDialog
              isOpen={this.state.showingDialog}
              onRequestClose={this.handleDialogClose}
              width={400}
              onSearch={this.handleUserSearch}
              onSelect={this.handleUserSelect}
              items={this.renderAutoCompleteSuggstions(this.props.relay.variables.memberAddSearch)}
              placeholder="Search all users…"
              selectLabel="Add"
              popover={false}
              ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
            />
          </div>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(memberAddSearch) {
    if (!this.props.team.organization.members || this.state.loading) {
      return [ <AutocompleteDialog.Loader key="loading" /> ]
    }

    // Either render the suggestions, or show a "not found" error
    if (this.props.team.organization.members.edges.length > 0) {
      return this.props.team.organization.members.edges.map(({ node }) => {
        return [<User key={node.user.id} user={node.user} />, node.user];
      });
    } else if (memberAddSearch !== "") {
      return [
        <AutocompleteDialog.ErrorMessage key="error">
          Could not find a user with name <em>{memberAddSearch}</em>
        </AutocompleteDialog.ErrorMessage>
      ];
    }

    return [
      <AutocompleteDialog.ErrorMessage key="error">
        Could not find any more users to add
      </AutocompleteDialog.ErrorMessage>
    ];
  }

  handleDialogOpen = () => {
    // First switch the component into a "loading" mode and refresh the data in the chooser
    this.setState({ loading: true }, () => {
      this.props.relay.forceFetch({ isMounted: true, teamSelector: `!${this.props.team.slug}` }, (state) => {
        if (state.done) {
          this.setState({ loading: false });
        }
      });

      // Now start showing the dialog, and when it's open, autofocus the first
      // result.
      this.setState({ showingDialog: true }, () => { this._autoCompletor.focus(); });
    });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
    this._autoCompletor.clear();
    this.props.relay.setVariables({ memberAddSearch: '' });
  };

  handleUserSearch = (memberAddSearch) => {
    this.setState({ searching: true });
    this.props.relay.forceFetch(
      { memberAddSearch },
      (state) => {
        if (state.done) {
          this.setState({ searching: false });
        }
      }
    );
  };

  handleUserSelect = (user) => {
    this.setState({ showingDialog: false });
    this._autoCompletor.clear();
    this.props.relay.setVariables({ memberAddSearch: '' });

    const query = Relay.QL`mutation TeamMemberCreateMutation {
      teamMemberCreate(input: $input) {
        clientMutationId
      }
    }`;

    const variables = {
      input: {
        teamID: this.props.team.id,
        userID: user.id
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
    memberAddSearch: '',
    teamSelector: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        slug

        organization {
          members(search: $memberAddSearch, first: 10, order: RELEVANCE, team: $teamSelector) @include (if: $isMounted) {
            edges {
              node {
                user {
                  id
                  name
                  email
                  avatar {
                    url
                  }
                }
              }
            }
          }
        }

        permissions {
          teamMemberCreate {
            allowed
          }
        }
      }
    `
  }
});
