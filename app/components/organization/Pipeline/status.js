import React from 'react';
import Relay from 'react-relay';

import BuildState from '../../icons/BuildState';

import BuildTooltip from './build-tooltip';

class Status extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      builds: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              state: React.PropTypes.string.isRequired,
              url: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

  state = {
    hover: false
  }

  render() {
    const buildEdge = this.props.pipeline.builds.edges[0];

    if (buildEdge) {
      const build = buildEdge.node;

      return (
        <a href={build.url}
          className="color-inherit relative"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          <span className="block line-height-1"><BuildState state={build.state} /></span>
          <BuildTooltip build={build} visible={this.state.hover} left={-8} top={44} />
        </a>
      );
    } else {
      return (
        <BuildState state="pending" />
      );
    }
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }
}

export default Relay.createContainer(Status, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        builds(first: 1, branch: "%default", state: [ BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED, BUILD_STATE_BLOCKED ]) {
          edges {
            node {
              state
              url
              ${BuildTooltip.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
