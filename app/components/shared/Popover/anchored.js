// @flow

import React from 'react';
import PropTypes from 'prop-types';

import Popover from '.';
import calculateViewportOffsets from './calculate-viewport-offsets';

type Props = {
  children: React$Node,
  className?: string,
  nibOffsetX: number,
  position: 'relative' | 'absolute',
  style?: Object,
  width: number
};

type State = {
  offsetX: number,
  offsetY: number,
  showing: boolean,
  width: number
};

export default class AnchoredPopover extends React.PureComponent<Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    nibOffsetX: PropTypes.number.isRequired,
    position: PropTypes.oneOf(['relative', 'absolute']).isRequired,
    style: PropTypes.object,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffsetX: 0,
    position: 'relative',
    style: {},
    width: 250
  };

  state = {
    offsetX: 0,
    offsetY: 45,
    showing: false,
    width: 250
  };

  wrapperNode: ?HTMLSpanElement;
  _resizeDebounceTimeout: ?TimeoutID;

  handleWindowResize = () => {
    // when hidden, we wait for the resize to be finished!
    // to do so, we clear timeouts on each event until we get
    // a good delay between them.
    const optimizeForHidden = !this.state.showing;

    // when hidden, we wait 2.5 times as long between
    // recalculations, which usually means a user is
    // done resizing by the time we do recalculate
    const debounceTimeout = (
      optimizeForHidden
        ? 250
        : 100
    );

    if (optimizeForHidden && this._resizeDebounceTimeout) {
      clearTimeout(this._resizeDebounceTimeout);
      delete this._resizeDebounceTimeout;
    }

    if (!this._resizeDebounceTimeout) {
      this._resizeDebounceTimeout = setTimeout(this.handleDebouncedWindowResize, debounceTimeout);
    }
  };

  handleDebouncedWindowResize = () => {
    if (this._resizeDebounceTimeout) {
      clearTimeout(this._resizeDebounceTimeout);
      delete this._resizeDebounceTimeout;
    }

    this.calculateViewportOffsets();
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize, false);
    this.calculateViewportOffsets();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);

    // Just in case...
    if (this._resizeDebounceTimeout) {
      clearTimeout(this._resizeDebounceTimeout);
      delete this._resizeDebounceTimeout;
    }
  }

  calculateViewportOffsets = () => {
    if (this.wrapperNode) {
      this.setState(calculateViewportOffsets(this.props.width, this.wrapperNode));
    }
  };

  handleMouseOver = (event: MouseEvent) => {
    // NOTE: We have to cast `event.target` to a Node to use with `contains`
    //       see <https://github.com/facebook/flow/issues/4645>
    const target: Node = (event.target: any);

    if (this.wrapperNode
      && this.wrapperNode.contains(target)) {
      this.setState({ showing: true });
    }
  };

  handleMouseOut = (event: MouseEvent) => {
    // NOTE: We have to cast `event.target` to a Node to use with `contains`
    //       see <https://github.com/facebook/flow/issues/4645>
    const target: Node = (event.target: any);

    if (this.wrapperNode
      && this.wrapperNode.contains(target)) {
      this.setState({ showing: false });
    }
  };

  renderPopover(children: React$Node) {
    if (!this.state.showing) {
      return;
    }

    const { width, offsetX, offsetY } = this.state;
    const { nibOffsetX } = this.props;

    return (
      <Popover
        offsetX={offsetX}
        offsetY={offsetY}
        nibOffsetX={nibOffsetX}
        width={width}
      >
        {children}
      </Popover>
    );
  }

  render() {
    const { className, position, style } = this.props;

    const [firstChild, ...children] = React.Children.toArray(this.props.children);

    const wrapperStyle = Object.assign({ position }, style);

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={className}
        style={wrapperStyle}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {firstChild}
        {this.renderPopover(children)}
      </span>
    );
  }
}
