// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {createRefetchContainer, graphql} from 'react-relay/compat';
import BuildTooltip from './BuildTooltip';
import AnchoredPopover from 'app/components/shared/Popover/anchored';
import { BAR_HEIGHT_MINIMUM, BAR_WIDTH, BAR_WIDTH_WITH_SEPERATOR, GRAPH_HEIGHT } from './constants';
import type {Bar_build} from './__generated__/Bar_build.graphql';

type Props = {
  href?: string,
  color: string,
  hoverColor: string,
  duration: number,
  graph: {
    maximumDuration: number
  },
  left: number,
  build: Bar_build,
  showFullGraph: boolean
};

type State = {
  hover: boolean,
};

class Bar extends React.Component<Props, State> {
  static defaultProps = {
    showFullGraph: true
  };

  state = {
    hover: false
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
    let height = (this.props.duration / this.props.graph.maximumDuration);
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
        <AnchoredPopover
          position="absolute"
          style={{ height: '100%', left: this.props.left, bottom: 0 }}
          width={300}
        >
          <a
            href={this.props.href}
            className="border-box inline-block color-inherit"
            style={{ height: '100%', width: BAR_WIDTH_WITH_SEPERATOR }}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          >
            <div
              className="border-box inline-block absolute animation-height"
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
            />
          </a>
          <BuildTooltip
            build={this.props.build}
            visible={this.state.hover}
          />
        </AnchoredPopover>
      );
    }

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

export default createRefetchContainer(Bar, graphql`
  fragment Bar_build on Build {
      ...BuildTooltip_build
    }
`);