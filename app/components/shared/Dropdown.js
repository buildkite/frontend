// @flow

import React from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classNames from 'classnames';

import Popover from './Popover';
import calculateViewportOffsets from './Popover/calculate-viewport-offsets';

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
  popupNode: ?HTMLElement;
  _resizeDebounceTimeout: ?number;

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
    document.documentElement && document.documentElement.addEventListener('click', this.handleDocumentClick);
    document.documentElement && document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown);
    window.addEventListener('resize', this.handleWindowResize, false);
    this.calculateViewportOffsets();
  }

  componentWillUnmount() {
    document.documentElement && document.documentElement.removeEventListener('click', this.handleDocumentClick);
    document.documentElement && document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
    window.removeEventListener('resize', this.handleWindowResize);
    this._resizeDebounceTimeout = clearTimeout(this._resizeDebounceTimeout); // just in case
  }

  calculateViewportOffsets = () => {
    if (this.wrapperNode) {
      this.setState(calculateViewportOffsets(this.props.width, this.wrapperNode));
    }
  }

  handleDocumentClick = (event: MouseEvent) => {
    // NOTE: We have to cast `event.target` to a Node to use with `contains`
    //       see <https://github.com/facebook/flow/issues/4645>
    const target: Node = (event.target: any);

    const clickWasInComponent = this.wrapperNode && this.wrapperNode.contains(target);

    // We don't have a ref to the popup button, so to detect a click on the
    // button we detect that it "wasn't" in the popup node, leaving only the
    // button that it could have been in
    const buttonWasClicked = clickWasInComponent && (!this.popupNode || !this.popupNode.contains(target));

    if (buttonWasClicked) {
      this.setShowing(!this.state.showing);
    } else if (this.state.showing && !clickWasInComponent) {
      this.setShowing(false);
    }
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
    if (!this.state.showing) {
      return;
    }

    const { offsetX, width } = this.state;
    const offsetY = this.state.offsetY + this.props.offsetY;
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
    const [firstChild, ...children] = React.Children.toArray(this.props.children);
    const wrapperClassName = classNames('relative', this.props.className);

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        style={this.props.style}
        className={wrapperClassName}
      >
        {firstChild}
        <CSSTransitionGroup
          transitionName="transition-popup"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {this.renderPopover(children)}
        </CSSTransitionGroup>
      </span>
    );
  }
}
