import React from 'react';
import Relay from 'react-relay';

import Emojify from '../../shared/Emojify';

import PusherStore from '../../../stores/PusherStore';
import BuildState from '../../icons/BuildState';

class BuildsDropdownBuild extends React.Component {
  static propTypes = {
    build: React.PropTypes.object
  }

  state = {
    hover: false
  }

  componentDidMount() {
    PusherStore.on("websocket:event", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handlePusherWebsocketEvent);
  }

  render() {
    const commitClassName = this.state.hover ? "lime" : "dark-gray";

    return (
      <div className="flex mb2" style={{ fontSize: "12px" }}>
        <a href={this.props.build.url} className="pr2">
          <div>
            <BuildState state={this.props.build.state} size={'small'} />
          </div>
        </a>
        <div className="flex-auto">
          <a href={this.props.build.url} className="mb1 black text-decoration-none hover-lime block" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            <Emojify text={this.props.build.message} className="emoji-small" /> <span className={commitClassName}>{this.shortCommit(this.props.build.commit)}</span>
          </a>
          <a href={`/${this.props.build.organization.slug}/${this.props.build.pipeline.slug}`} className="dark-gray text-decoration-none hover-navy">{this.props.build.organization.name} / {this.props.build.pipeline.name}</a>
        </div>
      </div>
    );
  }

  shortCommit(commit) {
    // Does this commit look like a git sha?
    if (commit && commit.length == 40) {
      return commit.substring(0, 7);
    } else {
      return commit;
    }
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }

  handlePusherWebsocketEvent = (payload) => {
    if (payload.event === "build:updated" && payload.graphql.id === this.props.build.id) {
      this.props.relay.forceFetch();
    }
  };
}

export default Relay.createContainer(BuildsDropdownBuild, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        id
        message
        state
        url
        commit
        organization {
          name
          slug
        }
        pipeline {
          name
          slug
        }
      }
    `
  }
});
