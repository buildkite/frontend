import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel'
import Button from '../shared/Button'
import UserAvatar from '../shared/UserAvatar'
import permissions from '../../lib/permissions';

class Index extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      teams: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired,
              name: React.PropTypes.string.isRequired,
              members: React.PropTypes.shape({
                count: React.PropTypes.number.isRequired
              }).isRequired,
              pipelines: React.PropTypes.shape({
                count: React.PropTypes.number.isRequired
              }).isRequired
            }).isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      permissions: React.PropTypes.object.isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.organization.name}`}>
        <Panel>
          <Panel.Header>Teams</Panel.Header>
          <Panel.IntroWithButton>
            <span>Manage your teams and make some awesome ones so you can do super awesome stuff like organzing users and projects into teams so you can do permissions and stuff.</span>
            {this.renderNewTeamButton()}
          </Panel.IntroWithButton>
          {
            this.props.organization.teams.edges.map((team) => {
              return (
                <Panel.RowLink key={team.node.id} to={`/organizations/${this.props.organization.slug}/teams/${team.node.slug}`}>
                  <strong className="semi-bold">{team.node.name}</strong><br/>
                  <span className="regular dark-gray">{team.node.members.count} members · {team.node.pipelines.count} projects</span><br/>
                  <div style={{marginTop: 3}}>
                    {
                      team.node.members.edges.map((member, index) => {
                        return (
                          <UserAvatar key={member.node.id} user={member.node.user} style={{width: 20, height: 20, marginRight: -4, zIndex: team.node.members.edges.length - index, position: "relative"}} />
                        )
                      })
                    }
                  </div>
                </Panel.RowLink>
                )
            })
          }
        </Panel>
      </DocumentTitle>
    );
  }

  renderNewTeamButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "teamCreate",
        render: () => <Button link={`/organizations/${this.props.organization.slug}/teams/new`}>New Team</Button>
      }
    )
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        permissions {
          teamCreate {
            allowed
          }
        }
        teams(first: 100) {
          edges {
            node {
              id,
              name,
              description,
              slug,
              members(first: 3) {
                count
                edges {
                  node {
                    user {
                      name
                      avatar {
                        url
                      }
                    }
                  }
                }
              },
              pipelines {
                count
              }
            }
          }
        }
      }
    `
  }
});
