import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import BuildTooltip from './build-tooltip';

import { BAR_HEIGHT_MINIMUM, BAR_WIDTH, BAR_WIDTH_WITH_SEPERATOR, GRAPH_HEIGHT } from './constants';

export default class Bar extends React.Component {
  static propTypes = {
    href: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    duration: React.PropTypes.number,
    maximumDuration: React.PropTypes.number,
    left: React.PropTypes.number.isRequired,
    build: React.PropTypes.object,
    showFullGraph: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    showFullGraph: true
  };

  state = {
    hover: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }

  calculateSizes() {
    // Calcualte what percentage this bar is in relation to the longest
    // running build
    let height = (this.props.duration / this.props.maximumDuration);
    let transform = 'none';

    // See if the height is less than our minimum. If it is, set a hard pixel
    // height, otherwise make the height a percentage. We use percentages so
    // we can animate the height of the graph as it loads in.
    const heightInPixels = (height * GRAPH_HEIGHT);
    if (heightInPixels < BAR_HEIGHT_MINIMUM) {
      height = BAR_HEIGHT_MINIMUM;
    } else {
      height = `${height * 100}%`;
      if (!this.props.showFullGraph) {
        transform = `scaleY(${BAR_HEIGHT_MINIMUM / heightInPixels})`;
      }
    }

    return { height, transform };
  }

  render() {
    const { height, transform } = this.calculateSizes();
    const backgroundColor = this.state.hover ? this.props.hoverColor : this.props.color;

    if (this.props.href) {
      return (
        <a href={this.props.href}
          className="border-box inline-block absolute color-inherit"
          style={{ height: "100%", left: this.props.left, width: BAR_WIDTH_WITH_SEPERATOR, bottom: 0 }}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          <div
            style={{
              height,
              width: BAR_WIDTH,
              left: 0,
              bottom: 0,
              backgroundColor,
              transform,
              transformOrigin: 'bottom',
              transition: 'transform 200ms ease-in-out'
            }}
            className="border-box inline-block absolute animation-height"
          />
          <BuildTooltip build={this.props.build} visible={this.state.hover} left={-20} top={47} />
        </a>
      );
    } else {
      return (
        <div
          className="border-box inline-block absolute"
          style={{
            height: BAR_HEIGHT_MINIMUM,
            left: this.props.left,
            width: BAR_WIDTH,
            bottom: 0,
            border: `1px solid ${backgroundColor}`
          }}
        />
      );
    }
  }
}
