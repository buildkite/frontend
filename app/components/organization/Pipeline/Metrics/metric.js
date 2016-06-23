import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

class Metric extends React.Component {
  static propTypes = {
    pipelineMetric: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string,
      url: React.PropTypes.string
    }).isRequired
  };

  render() {
    return (
      <a href={this.props.pipelineMetric.url} className="flex flex-column text-decoration-none color-inherit" style={{width: '7em'}}>
        <span className="h6 regular dark-gray truncate">{this.props.pipelineMetric.label}</span>
        {this.renderValue()}
      </a>
    )
  }

  renderValue() {
    let match = String(this.props.pipelineMetric.value).match(/([\d\.]+)(.*)/);
    let valueClasses = "h3 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h6 regular m0 line-height-1 dark-gray">{match[2]}</span>
        </span>
      )
    } else if(this.props.pipelineMetric.value) {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.pipelineMetric.value}</span>
      );
    } else {
      return (
        <span className={classNames(valueClasses, "gray")}>&middot;</span>
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
