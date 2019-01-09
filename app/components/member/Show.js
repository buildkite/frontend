import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageHeader from 'app/components/shared/PageHeader';
import UserAvatar from 'app/components/shared/UserAvatar';
import TabControl from 'app/components/shared/TabControl';
import Emojify from 'app/components/shared/Emojify';
import permissions from 'app/lib/permissions';

const AVATAR_SIZE = 50;

class Show extends React.PureComponent {
  static displayName = "Member.Show";

  static propTypes = {
    children: PropTypes.node.isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        permissions: PropTypes.shape({
          teamView: PropTypes.shape({
            allowed: PropTypes.bool.isRequired
          }).isRequired
        }).isRequired
      }).isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired
    })
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    if (!this.props.organizationMember) {
      return null;
    }

    return (
      <DocumentTitle title={`Users · ${this.props.organizationMember.user.name}`}>
        <div>
          <PageHeader followedByTabs={true}>
            <PageHeader.Icon>
              <UserAvatar
                user={this.props.organizationMember.user}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            </PageHeader.Icon>
            <PageHeader.Title className="truncate mr2">
              {this.props.organizationMember.user.name}
            </PageHeader.Title>
            <PageHeader.Description className="truncate mr2">
              {this.props.organizationMember.user.email}
            </PageHeader.Description>
          </PageHeader>

          {this.props.organizationMember.user.bot && this.renderBotMessage()}

          {this.renderTabs()}

          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }

  renderBotMessage() {
    return (
      <div className="border border-gray p3 rounded my2">
        <Emojify text=":robot_face:"/> {this.props.organizationMember.user.name} is a bot user managed by Buildkite.
      </div>
    )
  }

  renderTabs() {
    const tabContent = permissions(this.props.organizationMember.organization.permissions).collect(
      {
        always: true,
        render: (idx) => (
          <TabControl.Tab
            key={idx}
            to={`/organizations/${this.props.organizationMember.organization.slug}/users/${this.props.organizationMember.uuid}/settings`}
          >
            Settings
          </TabControl.Tab>
        )
      },
      {
        allowed: "teamView",
        render: (idx) => (
          <TabControl.Tab
            key={idx}
            to={`/organizations/${this.props.organizationMember.organization.slug}/users/${this.props.organizationMember.uuid}/teams`}
            badge={this.props.organizationMember.teams.count}
          >
            Teams
          </TabControl.Tab>
        )
      }
    );

    return (
      <TabControl>
        {tabContent}
      </TabControl>
    );
  }
}

export default Relay.createContainer(Show, {
  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        organization {
          slug
          permissions {
            teamView {
              allowed
            }
          }
        }
        user {
          id
          name
          email
          bot
          avatar {
            url
          }
        }
        teams {
          count
        }
      }
    `
  }
});
