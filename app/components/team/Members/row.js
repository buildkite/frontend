import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import User from './user';

class Row extends React.Component {
  static displayName = "Team.Members.Row";

  static propTypes = {
    member: React.PropTypes.shape({
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
    onTeamAdminToggle: React.PropTypes.func.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    removing: false,
    updating: false
  }

  render() {
    return (
      <Panel.Row>
	<User user={this.props.member.user} teamAdmin={this.props.member.admin} />
        <Panel.RowActions>
          {this.renderActions()}
        </Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    var transactions = this.props.relay.getPendingTransactions(this.props.member);
    var transaction = transactions ? transactions[0] : null;

    if(transaction && transaction.getStatus() == "COMMITTING") {
      return (
        <Icon icon="spinner" className="dark-gray animation-spin" style={{width: 18, height: 18}} />
      );
    } else {
      return permissions(this.props.member.permissions).collect(
        {
          allowed: "teamMemberUpdate",
          render: (idx) => (
            <Button key={idx} loading={this.state.updating ? "Updating…" : false} theme={"default"} outline={true} className="mr2"
              onClick={this.handleTeamAdminToggle}>{this.props.member.admin ? "Remove team Admin" : "Promote to Team Admin"}</Button>
          )
        },
        {
          allowed: "teamMemberDelete",
          render: (idx) => (
            <Button key={idx} loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true}
              onClick={this.handleMemberRemove}>Remove</Button>
          )
        }
      )
    }
  }

  handleTeamAdminToggle = (e) => {
    e.preventDefault();
    this.setState({ updating: true });

    this.props.onTeamAdminToggle(this.props.member, !this.props.member.admin, (error) => {
      this.setState({ updating: false });

      if(error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };

  handleMemberRemove = (e) => {
    e.preventDefault();
    this.setState({ removing: true });

    this.props.onRemoveClick(this.props.member, (error) => {
      this.setState({ removing: false });

      if(error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };
}

export default Row;
