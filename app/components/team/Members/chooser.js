import React from 'react';
import Relay from 'react-relay';

import AutocompleteField from '../../shared/AutocompleteField';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import permissions from '../../../lib/permissions';

import FlashesStore from '../../../stores/FlashesStore';

import TeamMemberCreateMutation from '../../../mutations/TeamMemberCreate';

import User from './user';

const PAGE_SIZE = 10;

class Chooser extends React.Component {
  static displayName = "Team.Members.Chooser";

  static propTypes = {
    team: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        members: React.PropTypes.shape({
          edges: React.PropTypes.array.isRequired
        })
      }),
      permissions: React.PropTypes.shape({
        teamMemberCreate: React.PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
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
        allowed: "teamMemberCreate",
        render: () => (
          <div>
            <Button onClick={this.handleDialogOpen}>Add User…</Button>
            <Dialog
              isOpen={this.state.showingDialog}
              onRequestClose={this.handleDialogClose}
              width={350}
            >
              <AutocompleteField
                onSearch={this.handleUserSearch}
                onSelect={this.handleUserSelect}
                items={this.renderAutoCompleteSuggstions(this.props.relay.variables.memberAddSearch)}
                placeholder="Add user…"
                ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
              />
            </Dialog>
          </div>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(memberAddSearch) {
    if (!this.props.team.organization.members) {
      return [];
    }

    // Either render the suggestions, or show a "not found" error
    if (this.props.team.organization.members.edges.length > 0) {
      return this.props.team.organization.members.edges.map(({ node }) => {
        return [<User key={node.user.id} user={node.user} />, node.user];
      });
    } else if (memberAddSearch !== "") {
      return [
        <AutocompleteField.ErrorMessage key="error">
          Could not find a user with name <em>{memberAddSearch}</em>
        </AutocompleteField.ErrorMessage>
      ];
    } else {
      return [];
    }
  }

  handleDialogOpen = () => {
    this.setState({ showingDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
  };

  handleUserSearch = (memberAddSearch) => {
    this.props.relay.setVariables({ memberAddSearch });
  };

  handleUserSelect = (user) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ memberAddSearch: "" });
    this._autoCompletor.focus();

    Relay.Store.commitUpdate(new TeamMemberCreateMutation({
      team: this.props.team,
      user: user
    }), { onFailure: (transaction) => FlashesStore.flash(FlashesStore.ERROR, transaction.getError()) });
  };
}

export default Relay.createContainer(Chooser, {
  initialVariables: {
    isMounted: false,
    memberAddSearch: '',
    teamSelector: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        slug
        ${TeamMemberCreateMutation.getFragment('team')}

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
                  ${TeamMemberCreateMutation.getFragment('user')}
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
