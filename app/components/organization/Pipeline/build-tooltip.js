import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Emojify from '../../shared/Emojify';
import UserAvatar from "../../shared/UserAvatar";
import Media from "../../shared/Media";
import FriendlyTime from "../../shared/FriendlyTime";

class BuildTooltip extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired,
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    build: React.PropTypes.shape({
      createdBy: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        avatar: React.PropTypes.shape({
          url: React.PropTypes.string
        }).isRequired
      }),
      message: React.PropTypes.string,
      startedAt: React.PropTypes.string,
      finishedAt: React.PropTypes.string
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if (this.props.visible) {
      return (
        <div>
          <div className="bg-white rounded shadow border border-gray p2 block absolute pointer-events-none z2" style={{ left: this.props.left, top: this.props.top, width: 230 }}>
            <img src={require('../../../images/up-pointing-white-nib.svg')} width={32} height={20} alt="" className="absolute pointer-events-none" style={{ top: -20, left: 7 }} />
            <Media align="top">
              <Media.Image className="mr2" style={{ width: 30, height: 30 }} >
                <UserAvatar user={this.props.build.createdBy} className="fit" />
              </Media.Image>
              <Media.Description className="truncate">
                <Emojify className="block line-height-1 truncate" text={this.props.build.message} />
                <small className="dark-gray">{this.renderTime()}</small>
              </Media.Description>
            </Media>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  renderTime() {
    if (this.props.build.startedAt || this.props.build.finishedAt) {
      return (
        <FriendlyTime value={this.props.build.finishedAt || this.props.build.startedAt} capitalized={true} />
      );
    } else {
      return (
        <div>something</div>
      );
    }
  }
}

export default Relay.createContainer(BuildTooltip, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        state
        message
        startedAt
        finishedAt
        url
        createdBy {
          ... on User {
            name
            avatar {
              url
            }
          }
          ...on UnregisteredUser {
            name
            avatar {
              url
            }
          }
        }
      }
    `
  }
});
