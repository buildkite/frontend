import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

class Metric extends React.Component {
  static propTypes = {
    metric: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired,
      url: React.PropTypes.string
    }).isRequired
  };

  render() {
    return (
      <a href={this.props.metric.url} className="flex flex-column right-align text-decoration-none color-inherit" style={{width: '7em'}}>
        {this.renderValue()}
        <span className="h6 regular dark-gray truncate">{this.props.metric.label}</span>
      </a>
    )
  }

  renderValue() {
    let match = String(this.props.metric.value).match(/([\d\.]+)(.*)/);
    let valueClasses = "h3 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h6 regular m0 line-height-1">{match[2]}</span>
        </span>
      )
    } else {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.metric.value}</span>
      );
    }
  }
}

export default Relay.createContainer(Metric, {
  fragments: {
    metric: () => Relay.QL`
      fragment on Metric {
        label
        value
        url
      }
    `
  }
});
