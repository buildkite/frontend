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
    onRemoveClick: React.PropTypes.func.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    removing: false
  }

  render() {
    return (
      <Panel.Row>
	<User user={this.props.member.user} />
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
      return (
        <Button loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true}
          onClick={this.handleMemberRemove}>Remove</Button>
      );
    }
  }

  handleMemberRemove = (e) => {
    e.preventDefault();
    this.setState({ removing: true });
    this.props.onRemoveClick(this.props.member);
  };
}

export default Row;
