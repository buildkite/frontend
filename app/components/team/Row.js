import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import { formatNumber } from '../../lib/number';
import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';
import Emojify from '../shared/Emojify';
import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

const maxAvatars = 4;
const avatarSize = 30;

class TeamRow extends React.PureComponent {
  static propTypes = {
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      slug: PropTypes.string.isRequired,
      privacy: PropTypes.string.isRequired,
      isDefaultTeam: PropTypes.bool.isRequired,
      organization: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired,
      members: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      pipelines: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.team.id} to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}`}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            <div className="m0 flex items-center"><Emojify text={this.props.team.name} className="semi-bold" />{this._renderPrivacyLabel()}{this._renderDefaultLabel()}</div>
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

  _renderPrivacyLabel() {
    if (this.props.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <div className="ml1 regular small border border-gray rounded dark-gray p1">Secret</div>
      );
    }
  }

  _renderDefaultLabel() {
    if (this.props.team.isDefaultTeam) {
      return (
        <div className="ml1 regular small border border-gray rounded dark-gray p1">Default</div>
      );
    }
  }

  _renderPipelineCount() {
    if (this.props.team.pipelines.count !== 0) {
      return (
        <span className="regular mr2">
          {this.props.team.pipelines.count} pipeline{this.props.team.pipelines.count === 1 ? '' : 's'}
        </span>
      );
    }
  }

  _renderMemberAvatars() {
    if (this.props.team.members.count !== 0) {
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
        <div className="inline-block bg-gray bold center border border-white semi-bold px1"
          style={{ borderRadius: avatarSize / 2, minWidth: avatarSize, height: avatarSize, lineHeight: `${avatarSize - 4}px`, fontSize: 11, borderWidth: 2 }}
          title={`and another ${formatNumber(extrasCount)} member${extrasCount === 1 ? '' : 's'}`}
        >
          {"+" + formatNumber(extrasCount)}
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
        privacy
        isDefaultTeam
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
