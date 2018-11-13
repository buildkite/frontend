// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import Metric from './metric';

class Metrics extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      metrics: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              label: PropTypes.string.isRequired
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
