// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Metric from './Metric';
import type { Metrics_pipeline } from './__generated__/Metrics_pipeline.graphql';

type Props = {
  pipeline: Metrics_pipeline
};

class Metrics extends React.Component<Props> {
  get metricsEdges() {
    if (this.props.pipeline.metrics && this.props.pipeline.metrics.edges) {
      return this.props.pipeline.metrics.edges;
    }
    return [];
  }

  render() {
    return (
      <div className="flex items-center">
        {this.metricsEdges.map((metricsEdge) => (
          metricsEdge && metricsEdge.node ? (
            <Metric key={metricsEdge.node.label} metric={metricsEdge.node} />
          ) : null
        ))}
      </div>
    );
  }
}

export default createFragmentContainer(Metrics, {
  pipeline: graphql`
    fragment Metrics_pipeline on Pipeline {
      metrics(first: 6) {
        edges {
          node {
            label
            ...Metric_metric
          }
        }
      }
    }
  `
});
