import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import BuildStatus from "../../shared/BuildStatus";
import Emojify from '../../shared/Emojify';
import UserAvatar from "../../shared/UserAvatar";
import Media from "../../shared/Media";
import Duration from "../../shared/Duration";

import { shortMessage, shortCommit, buildTime } from '../../../lib/builds';

class BuildTooltip extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired,
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    build: React.PropTypes.shape({
      commit: React.PropTypes.string,
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
        <div style={{ fontSize: 13 }}>
          <div className="bg-white rounded-2 shadow border border-gray p2 block absolute pointer-events-none z2" style={{ left: this.props.left, top: this.props.top, width: 230 }}>
            <img src={require('../../../images/up-pointing-white-nib.svg')} width={32} height={20} alt="" className="absolute pointer-events-none" style={{ top: -20, left: 7 }} />
            <Media align="top">
              <Media.Image className="mr2 center" style={{ width: 30 }} >
                <UserAvatar user={this.props.build.createdBy} className="block fit" />
                <small className="dark-gray"><Duration.Micro {...buildTime(this.props.build)} /></small>
              </Media.Image>
              <Media.Description className="line-height-2">
                <span className="block line-height-3"><Emojify className="semi-bold" text={shortMessage(this.props.build.message)} /> <span className="dark-gray">{shortCommit(this.props.build.commit)}</span></span>
                <small className="dark-gray"><BuildStatus build={this.props.build} updateFrequency={0} /></small>
              </Media.Description>
            </Media>
          </div>
        </div>
      );
    } else {
      return <div />;
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
        commit
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
