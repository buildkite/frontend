// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import classNames from 'classnames';
import type { Metric_metric } from './__generated__/Metric_metric.graphql';

type Props = {
  metric: Metric_metric
};

class Metric extends React.PureComponent<Props> {
  render() {
    if (!this.props.metric) {
      return null;
    }

    return (
      <a href={this.props.metric.url} className="flex flex-column text-decoration-none color-inherit" style={{ width: '7em' }}>
        <span className="h6 regular dark-gray truncate">{this.props.metric.label}</span>
        {this.renderValue()}
      </a>
    );
  }

  renderValue() {
    const match = String(this.props.metric.value).match(/([\d.]+)(.*)/);
    const valueClasses = "h1 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h6 regular m0 line-height-1 dark-gray">{match[2]}</span>
        </span>
      );
    } else if (this.props.metric.value) {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.metric.value}</span>
      );
    }


    return (
      <span className={classNames(valueClasses, "gray")}>-</span>
    );
  }
}

export default createFragmentContainer(Metric, graphql`
  fragment Metric_metric on PipelineMetric {
    label
    value
    url
  }
`);
