import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import User from './user';
import Role from './role';

export default class Row extends React.PureComponent {
  static displayName = "Team.Members.Row";

  static propTypes = {
    teamMember: React.PropTypes.shape({
      user: React.PropTypes.object.isRequired,
      role: React.PropTypes.string.isRequired,
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
        <User user={this.props.teamMember.user} role={this.props.teamMember.role} />
        <Panel.RowActions className="ml2">{this.renderActions()}</Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    const transactions = this.props.relay.getPendingTransactions(this.props.teamMember);
    const transaction = transactions ? transactions[0] : null;

    if (transaction) {
      return (
        <Spinner size={18} color={false}/>
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
              onClick={this.handleMemberRemove}
            >Remove</Button>
          )
        }
      );
    }
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
