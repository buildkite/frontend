import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import Popover from '.';
import calculateViewportOffsets from './calculate-viewport-offsets';

export default class AnchoredPopover extends React.Component {
  static propTypes = {
    alwaysShow: React.PropTypes.bool,
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    nibOffset: React.PropTypes.number.isRequired,
    position: React.PropTypes.oneOf(['relative', 'absolute']).isRequired,
    style: React.PropTypes.object,
    width: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffset: 0,
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleWindowResize = () => {
    // when hidden, we wait for the resize to be finished!
    // to do so, we clear timeouts on each event until we get
    // a good delay between them.
    const optimizeForHidden = !this.state.showing && !this.props.alwaysShow;

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
    if (!this.state.showing && !this.props.alwaysShow) {
      return;
    }

    const { nibOffset } = this.props;
    const { width, offsetX, offsetY } = this.state;

    return (
      <Popover
        nibOffset={nibOffset}
        offsetX={offsetX}
        offsetY={offsetY}
        innerRef={(popupNode) => this.popupNode = popupNode}
        width={width}
      >
        {children}
      </Popover>
    );
  }

  render() {
    const { alwaysShow, className, position, style } = this.props;

    const [firstChild, ...children] = React.Children.toArray(this.props.children);
    const wrapperClassName = classNames(position, className);

    const eventProps = {};

    if (!alwaysShow) {
      eventProps.onMouseOver = this.handleMouseOver;
      eventProps.onMouseOut = this.handleMouseOut;
    }

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={wrapperClassName}
        style={style}
        {...eventProps}
      >
        {firstChild}
        {this.renderPopover(children)}
      </span>
    );
  }
}
