import React from 'react';
import Relay from 'react-relay';

import BuildState from '../../icons/BuildState';

import Build from './build';

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

  render() {
    let buildEdge = this.props.pipeline.builds.edges[0];

    if(buildEdge) {
      let build = buildEdge.node;

      return (
        <Build build={build}>
          <a href={build.url} className="block line-height-1">
            <BuildState state={build.state} />
          </a>
        </Build>
      );
    } else {
      return (
        <BuildState state="pending" />
      );
    }
  }
}

export default Relay.createContainer(Status, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        builds(first: 1, state: [ BUILD_STATE_RUNNING, BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED ]) {
          edges {
            node {
              state
              url
              ${Build.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
