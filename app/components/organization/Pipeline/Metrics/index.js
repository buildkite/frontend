// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {createFragmentContainer, graphql} from 'react-relay/compat';
import Metric from './Metric';
import type {Metrics_pipeline} from './__generated__/Metrics_pipeline.graphql';

type Props = {
  pipeline: Metrics_pipeline
}

class Metrics extends React.Component<Props> {
  render() {
    return (
      <div className="flex items-center">
        {this.props.pipeline.metrics.edges.map((edge) => (
          <Metric key={edge.node.label} pipelineMetric={edge.node} />
        ))}
      </div>
    );
  }
}

export default createFragmentContainer(Metric, {
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
