import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Menu from '../shared/Menu';
import permissions from '../../lib/permissions';

class SettingsMenu extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      invitations: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      permissions: PropTypes.shape({
        organizationUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationMemberView: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamView: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamEnabledChange: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        notificationServiceUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        organizationBillingUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        auditEventsView: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }),
    relay: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Header>{this.props.organization.name}</Menu.Header>
          {this.renderButtons()}
        </Menu>

        <Menu>
          <Menu.Button
            href={`/user/settings`}
            label="Personal Settings"
          />
        </Menu>
      </div>
    );
  }

  renderButtons() {
    return permissions(this.props.organization.permissions).collect(
      {
        allowed: "organizationUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="settings"
            href={`/organizations/${this.props.organization.slug}/settings`}
            label="Settings"
          />
        )
      },
      {
        always: "organizationMemberView",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="users"
            link={`/organizations/${this.props.organization.slug}/users`}
            badge={this.calculateUsersCount()}
            label="Users"
          />
        )
      },
      {
        any: [
          "teamEnabledChange",
          "teamView"
        ],
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="teams"
            link={`/organizations/${this.props.organization.slug}/teams`}
            badge={this.props.organization.teams && this.props.organization.teams.count}
            label="Teams"
          />
        )
      },
      {
        allowed: "auditEventsView",
        and: () => Features.AuditLogsLaunch,
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="eye"
            link={`/organizations/${this.props.organization.slug}/audit-log`}
            label="Audit Log"
          />
        )
      },
      {
        allowed: "notificationServiceUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="notification-services"
            href={`/organizations/${this.props.organization.slug}/services`}
            label="Notification Services"
          />
        )
      },
      {
        allowed: "organizationUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="sso"
            link={`/organizations/${this.props.organization.slug}/sso`}
            label="Single Sign On"
          />
        )
      },
      {
        allowed: "organizationBillingUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="billing"
            href={`/organizations/${this.props.organization.slug}/billing`}
            label="Billing"
          />
        )
      }
    );
  }

  calculateUsersCount() {
    if (this.props.organization.members) {
      return this.props.organization.members.count + this.props.organization.invitations.count;
    }
  }
}

export default Relay.createContainer(SettingsMenu, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        members @include(if: $isMounted) {
          count
        }
        invitations(state: PENDING) @include(if: $isMounted) {
          count
        }
        teams @include(if: $isMounted) {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberView {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamView {
            allowed
          }
          teamEnabledChange {
            allowed
          }
          auditEventsView {
            allowed
          }
        }
      }
    `
  }
});
