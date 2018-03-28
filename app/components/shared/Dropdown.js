// @flow

import React from 'react';
import PropTypes from 'prop-types';
import transition from 'styled-transition-group';
const easeInBack = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)';
const easeOutBack = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

import Popover from './Popover';
import calculateViewportOffsets from './Popover/calculate-viewport-offsets';

const DropdownContainer = transition(Popover)`
  &:enter {
    opacity: 0;
    transform: scaleX(.8) scaleY(.5);
    transition: opacity 90ms ${easeOutBack}, transform 120ms ${easeOutBack};
  }

  &:enter-active {
    opacity: 1;
    transform: scaleX(1) scaleY(1);
  }

  &:exit {
    opacity: 1;
    transform: scaleX(1) scaleY(1);
    transition: opacity 90ms ${easeInBack}, transform 120ms ${easeInBack};
  }

  &:exit-active {
    opacity: 0;
    transform: scaleX(.8) scaleY(.5);
  }
`;

type Props = {
  children: React$Node,
  width: number,
  className?: string,
  style?: Object,
  onToggle?: Function,
  nibOffsetX: number,
  offsetY: number
};

type State = {
  showing: boolean,
  offsetX: number,
  offsetY: number,
  width: number
};

export default class Dropdown extends React.PureComponent<Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onToggle: PropTypes.func,
    nibOffsetX: PropTypes.number.isRequired,
    offsetY: PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffsetX: 0,
    offsetY: 0,
    width: 250
  };

  state = {
    showing: false,
    offsetX: 0,
    offsetY: 35,
    width: 250
  };

  wrapperNode: ?HTMLSpanElement;
  _resizeDebounceTimeout: ?TimeoutID;
  lastEventTime: ?number;

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
    document.documentElement && document.documentElement.addEventListener('click', this.handleDocumentClick);
    document.documentElement && document.documentElement.addEventListener('touchstart', this.handleDocumentTouchstart);
    document.documentElement && document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown);
    window.addEventListener('resize', this.handleWindowResize, false);
    this.calculateViewportOffsets();
  }

  componentWillUnmount() {
    document.documentElement && document.documentElement.removeEventListener('click', this.handleDocumentClick);
    document.documentElement && document.documentElement.removeEventListener('touchstart', this.handleDocumentTouchstart);
    document.documentElement && document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
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
  }

  getEventScope = (event: Event) => {
    // NOTE: We have to cast `event.target` to a Node to use with `contains`
    //       see <https://github.com/facebook/flow/issues/4645>
    const target: Node = (event.target: any);

    // NOTE: `wrapperNode`'s second element child (if any) is the popup node,
    //       and the first is always the popup button. In normal operation there
    //       will never be more than 2 element children, or fewer than one.
    const popupNode = (
      this.wrapperNode &&
      this.wrapperNode.childElementCount === 2 &&
      this.wrapperNode.lastElementChild
    );

    const wasInComponent = (
      this.wrapperNode &&
      this.wrapperNode.contains(target)
    );

    // We don't have a ref to the popup button, so to detect an event on the
    // button we detect that it "wasn't" in the popup node, leaving only the
    // button that it could have been in
    const wasInButton = (
      wasInComponent &&
      (!popupNode || !popupNode.contains(target))
    );

    return {
      wasInComponent,
      wasInButton
    };
  };

  handleDocumentClick = (event: MouseEvent) => {
    const { wasInComponent, wasInButton } = this.getEventScope(event);

    if (wasInButton) {
      this.setShowing(!this.state.showing);
    } else if (this.state.showing && !wasInComponent) {
      this.setShowing(false);
    }
  };

  handleDocumentTouchstart = (event: TouchEvent) => {
    const { wasInButton } = this.getEventScope(event);

    if (!wasInButton) {
      return;
    }

    // If this `touchstart` event was within the button, calculate how long it
    // was between this and the last `touchstart` event
    const timeDifference = (
      event.timeStamp - (this.lastEventTime || event.timeStamp)
    );

    // Keep track of the last event's time
    this.lastEventTime = event.timeStamp;

    // If we've not seen more than one touch event, or it's been longer than
    // 500ms, or if this touch event involves multiple fingers, do nothing
    if (!timeDifference || timeDifference > 500 || event.touches.length > 1) {
      return;
    }

    // Finally, if we meet all those conditions, abort the touchstart event
    // (this prevents double-tap zooming on the item)
    event.preventDefault();

    // And simulate the "click" behaviour by toggling the dropdown
    // (effectively making it possible to "click" faster than the OS would let us!)
    this.setShowing(!this.state.showing);
  };

  handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Handle the escape key
    if (this.state.showing && event.keyCode === 27) {
      this.setShowing(false);
    }
  };

  setShowing(showing: boolean) {
    this.setState({ showing: showing });

    if (this.props.onToggle) {
      this.props.onToggle(this.state.showing);
    }
  }

  renderPopover(children: React$Node): React$Node {
    const { offsetX, width } = this.state;
    const offsetY = this.state.offsetY + this.props.offsetY;
    const { nibOffsetX } = this.props;

    return (
      <DropdownContainer
        offsetX={offsetX}
        offsetY={offsetY}
        nibOffsetX={nibOffsetX}
        width={width}
        in={this.state.showing}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={200}
      >
        {children}
      </DropdownContainer>
    );
  }

  render() {
    const [firstChild, ...children] = React.Children.toArray(this.props.children);

    const wrapperStyle = Object.assign({ position: 'relative' }, this.props.style);

    const classNames = [this.props.className];

    if (this.state.showing) {
      classNames.push('Dropdown-showing');
    }

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        style={wrapperStyle}
        className={classNames.join(' ')}
      >
        {firstChild}
        {this.renderPopover(children)}
      </span>
    );
  }
}
