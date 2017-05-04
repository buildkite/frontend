import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Popover from '.';
import calculateViewportOffsets from './calculate-viewport-offsets';

export default class AnchoredPopover extends React.PureComponent {
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
      this._resizeDebounceTimeout = clearTimeout(this._resizeDebounceTimeout);
    }

    if (!this._resizeDebounceTimeout) {
      this._resizeDebounceTimeout = setTimeout(this.handleDebouncedWindowResize, debounceTimeout);
    }
  };

  handleDebouncedWindowResize = () => {
    this._resizeDebounceTimeout = clearTimeout(this._resizeDebounceTimeout);
    this.calculateViewportOffsets();
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize, false);
    this.calculateViewportOffsets();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handlewindowResize);
    this._resizeDebounceTimeout = clearTimeout(this._resizeDebounceTimeout); // just in case
  }

  calculateViewportOffsets = () => {
    this.setState(calculateViewportOffsets(this.props.width, this.wrapperNode));
  };

  handleMouseOver = (evt) => {
    if (this.wrapperNode.firstElementChild.contains(evt.target)) {
      this.setState({ showing: true });
    }
  };

  handleMouseOut = (evt) => {
    if (this.wrapperNode.firstElementChild.contains(evt.target)) {
      this.setState({ showing: false });
    }
  };

  renderPopover(children) {
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
        innerRef={(popupNode) => this.popupNode = popupNode}
        width={width}
      >
        {children}
      </Popover>
    );
  }

  render() {
    const { className, position, style } = this.props;

    const [firstChild, ...children] = React.Children.toArray(this.props.children);
    const wrapperClassName = classNames(position, className);

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={wrapperClassName}
        style={style}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {firstChild}
        {this.renderPopover(children)}
      </span>
    );
  }
}
