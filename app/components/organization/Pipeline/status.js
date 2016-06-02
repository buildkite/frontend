import React from 'react';
import Relay from 'react-relay';

import BuildState from '../../icons/BuildState';
import PusherStore from '../../../stores/PusherStore';

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

  state = {
    build: this.props.pipeline.builds.edges[0] ? this.props.pipeline.builds.edges[0].node : null
  };

  shouldComponentUpdate() {
    // Since this component updates itself, no need to re-render when the
    // parent does.
    return false;
  }

  componentDidMount() {
    PusherStore.on("build:change", this.handleStoreChange);
  }

  componentWillUnmount() {
    PusherStore.off("build:change", this.handleStoreChange);
  }

  render() {
    if(this.state.build) {
      return (
        <Build build={this.state.build}>
          <a href={this.state.build.url} className="block line-height-1">
            <BuildState state={this.state.build.state} />
          </a>
        </Build>
      );
    } else {
      return (
        <BuildState state="pending" />
      );
    }
  }

  handleStoreChange = (payload) => {
    if(payload.pipeline.id == this.props.pipeline.id) {
      console.log(payload);
// const node = Relay.QL`
//   query {
//     node(id: $channelId) {
//       ... on Channel {
//         joined
//       }
//     }
//   }
// `;
//
// const query = Relay.createQuery(node, {channelId});
// Relay.Store.primeCache({query}, readyState => {
//   // do stuff on readyState if you care
// });
    }
  };
}

export default Relay.createContainer(Status, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        builds(first: 1, state: [ BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED ]) {
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
