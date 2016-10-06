import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import BuildTooltip from './build-tooltip';

export default class Bar extends React.Component {
  static propTypes = {
    href: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    left: React.PropTypes.number.isRequired,
    build: React.PropTypes.object
  };

  state = {
    hover: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if (this.props.href) {
      return (
        <a href={this.props.href}
          className="border-box inline-block absolute color-inherit"
          style={{ height: "100%", left: this.props.left, width: this.props.width, bottom: 0 }}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          <div style={{ height: this.props.height, width: this.props.width - 1, left: 0, bottom: 0, backgroundColor: this.backgroundColor() }} className="border-box inline-block absolute animation-height" />
          <BuildTooltip build={this.props.build} visible={this.state.hover} left={-20} top={47} />
        </a>
      );
    } else {
      return (
        <div
          className="border-box inline-block absolute animation-height"
          style={{ backgroundColor: this.backgroundColor(), height: this.props.height, left: this.props.left, width: this.props.width - 1, bottom: 0 }}
        />
      );
    }
  }

  backgroundColor() {
    if (this.state.hover) {
      return this.props.hoverColor;
    } else {
      return this.props.color;
    }
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }
}
