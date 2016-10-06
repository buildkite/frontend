import React from 'react';
import { getDurationString } from '../../lib/date';

class Duration extends React.Component {
  static propTypes = {
    from: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Date)
    ]),
    to: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Date)
    ]),
    format: React.PropTypes.oneOf(getDurationString.formats),
    updateFrequency: React.PropTypes.number
  };

  static defaultProps = {
    updateFrequency: 1000
  };

  state = {
    value: ''
  };

  updateTime() {
    this.setState({
      value: getDurationString(this.props.from, this.props.to, this.props.format)
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (updateFrequency > 0) {
      this._interval = setInterval(() => this.updateTime(), updateFrequency);
    }
    this.updateTime();
  }

  maybeClearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  componentWillUnmount() {
    this.maybeClearInterval();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(nextProps.updateFrequency);
    }

    this.setState({
      value: getDurationString(nextProps.from, nextProps.to, nextProps.format)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.format !== this.props.format || nextProps.updateFrequency !== this.props.updateFrequency || nextState.value !== this.state.value;
  }

  render() {
    return (
      <span>{this.state.value}</span>
    );
  }
}

const exported = {};

getDurationString.formats.forEach((format) => {
  const componentName = format.charAt(0).toUpperCase() + format.slice(1);

  const component = (props) => <Duration {...props} format={format} />;
  component.displayName = `Duration.${componentName}`;

  exported[componentName] = component;
});

export default exported;
