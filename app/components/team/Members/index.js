import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import FormAutoCompleteField from '../../shared/FormAutoCompleteField';
import permissions from '../../../lib/permissions';

import TeamMemberCreateMutation from '../../../mutations/TeamMemberCreate';
import TeamMemberUpdateMutation from '../../../mutations/TeamMemberUpdate';
import TeamMemberDeleteMutation from '../../../mutations/TeamMemberDelete';

import Row from './row';
import User from './user';

class Members extends React.Component {
  static displayName = "Team.Members";

  static propTypes = {
    team: React.PropTypes.shape({
      members: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      }).isRequired,
      organization: React.PropTypes.object.isRequired,
      permissions: React.PropTypes.shape({
        teamMemberCreate: React.PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel className={this.props.className}>
        <Panel.Header>Members</Panel.Header>
        {this.renderAutoComplete()}
        {this.renderMembers()}
      </Panel>
    );
  }

  renderMembers() {
    if(this.props.team.members.edges.length > 0) {
      return this.props.team.members.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamMember={edge.node} onRemoveClick={this.handleTeamMemberRemove} onRoleChange={this.handleRoleChange} relay={this.props.relay} />
        )
      })
    } else {
      return <Panel.Section className="dark-gray">There are no users assigned to this team</Panel.Section>
    }
  }

  renderAutoComplete() {
    return permissions(this.props.team.permissions).check(
      {
        allowed: "teamMemberCreate",
        render: () => (
          <Panel.Section>
            <FormAutoCompleteField onSearch={this.handleUserSearch}
              onSelect={this.handleUserSelect}
              items={this.renderAutoCompleteSuggstions(this.props.relay.variables.search)}
              placeholder="Add existing user to this team…"
              ref={c => this._autoCompletor = c} />
          </Panel.Section>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(search) {
    // First filter out any members that are already in this list
    let suggestions = [];
    this.props.team.organization.members.edges.forEach((member) => {
      let found = false;
      this.props.team.members.edges.forEach((edge) => {
        if(edge.node.user.id == member.node.user.id) {
          found = true;
        }
      });

      if(!found) {
        suggestions.push(member.node.user);
      }
    });

    // Either render the sugggestions, or show a "not found" error
    if(suggestions.length > 0) {
      return suggestions.map((user) => {
        return [ <User key={user.id} user={user} />, user ];
      });
    } else if (search != "") {
      return [ <FormAutoCompleteField.ErrorMessage key={"error"}>Could not find a user with name <em>{search}</em></FormAutoCompleteField.ErrorMessage> ];
    } else {
      return [];
    }
  }

  handleUserSearch = (text) => {
    this.props.relay.setVariables({ search: text });
  };

  handleUserSelect = (user) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ search: "" });
    this._autoCompletor.focus();

    Relay.Store.commitUpdate(new TeamMemberCreateMutation({
      team: this.props.team,
      user: user
    }), { onFailure: (transaction) => alert(transaction.getError()) });
  };

  handleTeamMemberRemove = (teamMember, callback) => {
    Relay.Store.commitUpdate(new TeamMemberDeleteMutation({
      teamMember: teamMember
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleRoleChange = (teamMember, role, callback) => {
    Relay.Store.commitUpdate(new TeamMemberUpdateMutation({
      teamMember: teamMember,
      admin: (role == 'admin')
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };
}

export default Relay.createContainer(Members, {
  initialVariables: {
    search: ""
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${TeamMemberCreateMutation.getFragment('team')}

	organization {
	  members(search: $search, first: 10) {
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

	members(first: 100) {
	  edges {
	    node {
	      id
              admin
	      user {
		id
		name
		email
                avatar {
                  url
                }
	      }
              permissions {
                teamMemberUpdate {
                  allowed
                }
                teamMemberDelete {
                  allowed
                }
              }
              ${TeamMemberDeleteMutation.getFragment('teamMember')}
              ${TeamMemberUpdateMutation.getFragment('teamMember')}
	    }
	  }
	}
      }
    `
  }
});
