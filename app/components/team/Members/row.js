import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';

import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import Spinner from 'app/components/shared/Spinner';

import FlashesStore from 'app/stores/FlashesStore';
import permissions from 'app/lib/permissions';

// NOTE: While these mutations *run* from cosumers of the Row component,
//       in order for the data passed out to be consistent, their fragments
//       must be included within this component's fragment.
import TeamMemberUpdateMutation from 'app/mutations/TeamMemberUpdate';
import TeamMemberDeleteMutation from 'app/mutations/TeamMemberDelete';

import User from 'app/components/shared/User';
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
      }),
      team: PropTypes.shape({
        organization: PropTypes.shape({
          slug: PropTypes.string.isRequired
        })
      }),
      organizationMember: PropTypes.shape({
        uuid: PropTypes.string.isRequired
      }).isRequired
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
        <div className="flex">
          <Link
            className="truncate semi-bold black hover-lime hover-color-inherit-parent text-decoration-none"
            to={`/organizations/${this.props.teamMember.team.organization.slug}/users/${this.props.teamMember.organizationMember.uuid}`}
          >
            <User
              user={this.props.teamMember.user}
              inheritHoverColor={true}
            />
          </Link>
        </div>
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
        always: true,
        render: (idx) => (
          <Role
            key={idx}
            teamMember={this.props.teamMember}
            onRoleChange={this.handleRoleChange}
            savingNewRole={this.state.savingNewRole}
            teamMemberUpdatePermission={this.props.teamMember.permissions.teamMemberUpdate}
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
        team {
          organization {
            slug
          }
        }
        organizationMember {
          uuid
        }
      }
    `
  }
});
