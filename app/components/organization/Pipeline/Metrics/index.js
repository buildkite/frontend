import React from 'react';
import Relay from 'react-relay';

import Metric from "./metric";

class Metrics extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      metrics: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              label: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <div className="flex items-center">
        {this.props.pipeline.metrics.edges.map((edge) => <Metric key={edge.node.label} pipelineMetric={edge.node} />)}
      </div>
    );
  }
}

export default Relay.createContainer(Metrics, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        metrics(first: 6) {
          edges {
            node {
              label
              ${Metric.getFragment('pipelineMetric')}
            }
          }
        }
      }
    `
  }
});
