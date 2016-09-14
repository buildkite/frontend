import React from 'react';
import Relay from 'react-relay';

import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';
import Emojify from '../shared/Emojify';

const maxAvatars = 4;
const avatarSize = 30;

class TeamRow extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      slug: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      members: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      pipelines: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.team.id} to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}`}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            <div className="m0 semi-bold"><Emojify text={this.props.team.name} /></div>
            {this._renderDescription()}
          </div>
          <div className="flex flex-none flex-stretch items-center my1">
            {this._renderPipelineCount()}
            {this._renderMemberAvatars()}
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  _renderPipelineCount() {
    if (this.props.team.pipelines.count != 0) {
      return (
        <span className="regular mr2">
          {this.props.team.pipelines.count} pipeline{this.props.team.pipelines.count == 1 ? '' : 's'}
        </span>
      );
    }
  }

  _renderMemberAvatars() {
    if (this.props.team.members.count != 0) {
      return (
        <div className="mr3">
          {
            this.props.team.members.edges.map((edge) => {
              return (
                <UserAvatar
                  key={edge.node.id}
                  user={edge.node.user}
                  className="align-middle border border-white"
                  style={{ width: avatarSize, height: avatarSize, marginRight: -10, borderWidth: 2 }}
                />
              );
            })
          }
          {this._renderMemberExtrasCount()}
        </div>
      );
    }
  }

  _renderMemberExtrasCount() {
    const extrasCount = this.props.team.members.count - maxAvatars;

    if (extrasCount > 0) {
      return (
        <div className="inline-block bg-gray bold circle center border border-white semi-bold"
          style={{ width: avatarSize, height: avatarSize, lineHeight: `${avatarSize - 4}px`, fontSize: 11, borderWidth: 2 }}
          title={`and another ${extrasCount} member${extrasCount == 1 ? '' : 's'}`}
        >
          {"+" + extrasCount}
        </div>
      );
    }
  }

  _renderDescription() {
    if (this.props.team.description) {
      return (
        <div className="regular dark-gray mt1"><Emojify text={this.props.team.description} /></div>
      );
    }
  }
}

export default Relay.createContainer(TeamRow, {
  initialVariables: {
    maxAvatars: maxAvatars
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        name
        description
        slug
        organization {
          slug
        }
        members(first: $maxAvatars) {
          count
          edges {
            node {
              id
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
    `
  }
});
