import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';

import User from './user';

class Row extends React.Component {
  static displayName = "Team.Members.Row";

  static propTypes = {
    member: React.PropTypes.shape({
      user: React.PropTypes.object.isRequired,
      admin: React.PropTypes.bool.isRequired
    }).isRequired,
    viewer: React.PropTypes.shape({
      user: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
      }).isRequired
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

      // Don't show team admins buttons to modify their own membership
      if(this.props.member.admin && this.props.viewer.user.id == this.props.member.user.id) {
        return (
          <div className="dark-gray">Team Admin (You)</div>
        );
      } else {
        return (
          <div>
            <Button loading={this.state.updating ? "Updating…" : false} theme={"default"} outline={true} className="mr2"
              onClick={this.handleTeamAdminToggle}>{this.props.member.admin ? "Remove team Admin" : "Promote to Team Admin"}</Button>
            <Button loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true}
              onClick={this.handleMemberRemove}>Remove</Button>
          </div>
        );
      }
    }
  }

  handleTeamAdminToggle = (e) => {
    e.preventDefault();
    this.setState({ updating: true });

    this.props.onTeamAdminToggle(this.props.member, !this.props.member.admin, (error) => {
      this.setState({ updating: false });
      if(error) {
        alert(error);
      }
    });
  };

  handleMemberRemove = (e) => {
    e.preventDefault();
    this.setState({ removing: true });

    this.props.onRemoveClick(this.props.member);
  };
}

export default Row;
