import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import BuildState from '../../icons/BuildState';
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
        name: React.PropTypes.string.isRequired
      }),
      message: React.PropTypes.string,
      startedAt: React.PropTypes.string,
      finishedAt: React.PropTypes.string,
      state: React.PropTypes.string.isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(this.props.visible) {
      return (
        <div>
          <div className="bg-white rounded shadow border border-gray px2 py2 block absolute pointer-events-none z2 h6 line-height-1" style={{ left: this.props.left, top: this.props.top, width: 270 }}>
            <img src={require('../../../images/up-pointing-white-nib.svg')} width={32} height={20} alt="" className="absolute pointer-events-none" style={{top: -20, left: 7}} />
            <div className="flex">
              <div className="flex-none mr2 center" style={{ width: 30 }}>
                <BuildState state={this.props.build.state} size="small" />
                <div className="dark-gray mt1">3s</div>
              </div>
              <div>
                <div><Emojify text={this.props.build.message}/></div>
                <div className="mt1 dark-gray">{this.props.build.createdBy.name} {this.props.build.startedAt}</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>
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
