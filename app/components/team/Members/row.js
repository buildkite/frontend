import React from 'react';
import PropTypes from 'prop-types';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import User from './user';
import Role from './role';

export default class Row extends React.PureComponent {
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
            <Button
              key={idx}
              loading={this.state.removing ? "Removing…" : false}
              theme={"default"}
              outline={true}
              className="p0 ml3 flex circle items-center justify-center hover-black"
              style={{
                width: 30,
                height: 30
              }}
              onClick={this.handleMemberRemove}
            ><Icon icon="close" title="Remove" style={{width: 18, height: 18}} className="dark-gray hover-black-child" /></Button>
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
