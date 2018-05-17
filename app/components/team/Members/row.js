import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

// NOTE: While these mutations *run* from cosumers of the Row component,
//       in order for the data passed out to be consistent, their fragments
//       must be included within this component's fragment.
import TeamMemberUpdateMutation from '../../../mutations/TeamMemberUpdate';
import TeamMemberDeleteMutation from '../../../mutations/TeamMemberDelete';

import User from '../../shared/User';
import Role from './role';

class Row extends React.PureComponent {
  static displayName = "Team.Members.Row";

  static propTypes = {
    teamMember: PropTypes.shape({
      user: PropTypes.object.isRequired,
      role: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        teamMemberUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamMemberDelete: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    removing: false,
    savingNewRole: null
  }

  render() {
    return (
      <Panel.Row>
        <User
          user={this.props.teamMember.user}
          role={this.props.teamMember.role}
        />
        <Panel.RowActions className="ml2">
          {this.renderActions()}
        </Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    const transactions = this.props.relay.getPendingTransactions(this.props.teamMember);
    const transaction = transactions ? transactions[0] : null;

    if (transaction) {
      return (
        <Spinner size={18} color={false} />
      );
    }

    return permissions(this.props.teamMember.permissions).collect(
      {
        allowed: "teamMemberUpdate",
        render: (idx) => (
          <Role
            key={idx}
            teamMember={this.props.teamMember}
            onRoleChange={this.handleRoleChange}
            savingNewRole={this.state.savingNewRole}
          />
        )
      },
      {
        allowed: "teamMemberDelete",
        render: (idx) => (
          <Button
            key={idx}
            loading={this.state.removing ? "Removing…" : false}
            theme={"default"}
            outline={true}
            className="ml3"
            onClick={this.handleMemberRemove}
          >
            Remove
          </Button>
        )
      }
    );
  }

  handleRoleChange = (role) => {
    this.setState({ savingNewRole: role });

    this.props.onRoleChange(this.props.teamMember, role, (error) => {
      this.setState({ savingNewRole: null });

      if (error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };

  handleMemberRemove = (evt) => {
    if (confirm("Remove this user from the team?")) {
      evt.preventDefault();
      this.setState({ removing: true });

      this.props.onRemoveClick(this.props.teamMember, (error) => {
        this.setState({ removing: false });

        if (error) {
          FlashesStore.flash(FlashesStore.ERROR, error);
        }
      });
    }
  };
}

export default Relay.createContainer(Row, {
  fragments: {
    teamMember: () => Relay.QL`
      fragment on TeamMember {
        ${TeamMemberDeleteMutation.getFragment('teamMember')}
        ${TeamMemberUpdateMutation.getFragment('teamMember')}
        user {
          ${User.getFragment('user')}
        }
        role
        permissions {
          teamMemberUpdate {
            allowed
          }
          teamMemberDelete {
            allowed
          }
        }
      }
    `
  }
});