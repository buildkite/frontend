import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import User from './user';
import Role from './role';

class Row extends React.Component {
  static displayName = "Team.Members.Row";

  static propTypes = {
    teamMember: React.PropTypes.shape({
      user: React.PropTypes.object.isRequired,
      admin: React.PropTypes.bool.isRequired,
      permissions: React.PropTypes.shape({
        teamMemberUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        teamMemberDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    onRemoveClick: React.PropTypes.func.isRequired,
    onRoleChange: React.PropTypes.func.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    removing: false,
    savingNewRole: null
  }

  render() {
    return (
      <Panel.Row>
	<User user={this.props.teamMember.user} teamAdmin={this.props.teamMember.admin} />
        <Panel.RowActions>{this.renderActions()}</Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    var transactions = this.props.relay.getPendingTransactions(this.props.teamMember);
    var transaction = transactions ? transactions[0] : null;

    if(transaction) {
      return (
        <Spinner width={18} height={18} color={false}/>
      );
    } else {
      return permissions(this.props.teamMember.permissions).collect(
        {
          allowed: "teamMemberUpdate",
          render: (idx) => (
            <Role key={idx} teamMember={this.props.teamMember} onRoleChange={this.handleRoleChange} savingNewRole={this.state.savingNewRole} />
          )
        },
        {
          allowed: "teamMemberDelete",
          render: (idx) => (
            <Button key={idx} loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true} className="ml3"
              onClick={this.handleMemberRemove}>Remove</Button>
          )
        }
      )
    }
  }

  handleRoleChange = (role) => {
    this.setState({ savingNewRole: role });

    this.props.onRoleChange(this.props.teamMember, role, (error) => {
      this.setState({ savingNewRole: null });

      if(error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };

  handleMemberRemove = (e) => {
    if(confirm("Remove this user from the team?")) {
      e.preventDefault();
      this.setState({ removing: true });

      this.props.onRemoveClick(this.props.teamMember, (error) => {
        this.setState({ removing: false });

        if(error) {
          FlashesStore.flash(FlashesStore.ERROR, error);
        }
      });
    }
  };
}

export default Row;
