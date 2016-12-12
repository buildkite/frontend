import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import Popover from '.';
import calculateViewportOffsets from './calculate-viewport-offsets';

export default class AnchoredPopover extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    width: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    onToggle: React.PropTypes.func,
    nibOffset: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffset: 0,
    width: 250
  };

  state = {
    offsetX: 0,
    offsetY: 35,
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
    const [firstChild, ...children] = React.Children.toArray(this.props.children);
    const wrapperClassName = classNames('relative', this.props.className);

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={wrapperClassName}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {firstChild}
        {this.renderPopover(children)}
      </span>
    );
  }
}
