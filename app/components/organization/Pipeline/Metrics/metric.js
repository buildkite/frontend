import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

class Metric extends React.Component {
  static propTypes = {
    pipelineMetric: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      url: PropTypes.string
    }).isRequired
  };

  render() {
    return (
      <a href={this.props.pipelineMetric.url} className="flex flex-column text-decoration-none color-inherit" style={{ width: '7em' }}>
        <span className="h6 regular dark-gray truncate">{this.props.pipelineMetric.label}</span>
        {this.renderValue()}
      </a>
    );
  }

  renderValue() {
    const match = String(this.props.pipelineMetric.value).match(/([\d\.]+)(.*)/);
    const valueClasses = "h1 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h6 regular m0 line-height-1 dark-gray">{match[2]}</span>
        </span>
      );
    } else if (this.props.pipelineMetric.value) {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.pipelineMetric.value}</span>
      );
    } else {
      return (
        <span className={classNames(valueClasses, "gray")}>-</span>
      );
    }
  }
}

export default Relay.createContainer(Metric, {
  fragments: {
    pipelineMetric: () => Relay.QL`
      fragment on PipelineMetric {
        label
        value
        url
      }
    `
  }
});
