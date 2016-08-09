import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Emojify from '../../shared/Emojify';
import UserAvatar from "../../shared/UserAvatar";
import Media from "../../shared/Media";
import FriendlyTime from "../../shared/FriendlyTime";

class Build extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    build: React.PropTypes.object.isRequired
  };

  state = {
    visible: false,
    mouseX: 0,
    mouseY: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div onMouseOver={this.handleMouseOver} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        {this.renderBuild()}
        {this.props.children}
      </div>
    );
  }

  renderBuild() {
    if(this.state.visible) {
      return (
        <div className="bg-white rounded shadow border border-gray p2 block fixed" style={{ zIndex: 100, left: this.state.mouseX + 10, top: this.state.mouseY + 10, width: 230 }}>
          <Media align="top">
            <Media.Image className="mr2" style={{width: 30, height: 30}} >
              <UserAvatar user={this.props.build.createdBy} className="fit" />
            </Media.Image>
            <Media.Description className="truncate">
              <Emojify className="block line-height-1 truncate" text={this.props.build.message} />
              <small className="dark-gray">{this.renderTime()}</small>
            </Media.Description>
          </Media>
        </div>
      );
    }
  }

  renderTime() {
    if(this.props.build.startedAt || this.props.build.finishedAt) {
      return (
        <FriendlyTime value={this.props.build.finishedAt || this.props.build.startedAt} />
      )
    } else {
      return (
        <div>something</div>
      )
    }
  }

  handleMouseOver = (e) => {
    this.setState({ visible: true, mouseX: e.clientX, mouseY: e.clientY });
  };

  handleMouseMove = (e) => {
    this.setState({ mouseX: e.clientX, mouseY: e.clientY });
  };

  handleMouseOut = () => {
    this.setState({ visible: false });
  };
}

export default Relay.createContainer(Build, {
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
