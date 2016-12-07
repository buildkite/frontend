import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import styled from 'styled-components';

const NIB_WIDTH = 32;

// margin (in pixels) to maintain around automatically-positioned dropdowns
const SCREEN_MARGIN = 10;

const ScrollZone = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Nib = styled.img`
  top: -20px;
  width: ${NIB_WIDTH}px;
  height: 20px;
  z-index: 3;
`;

Nib.defaultProps = {
  className: 'absolute pointer-events-none'
};

class Dropdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    width: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    onToggle: React.PropTypes.func,
    nibOffset: React.PropTypes.number
  };

  static defaultProps = {
    align: 'center',
    nibOffset: 0,
    width: 250
  };

  state = {
    showing: false,
    offsetX: 0,
    offsetY: 35,
    width: 250
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleWindowResize = () => {
    if (this.props.align === 'center') {
      return;
    }

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

  calculateViewportOffsets = () => {
    const windowWidth = window.innerWidth;
    const { left: wrapperLeft, width: wrapperWidth, height: wrapperHeight } = this.wrapperNode.getBoundingClientRect();

    const wrapperCenter = wrapperLeft + (wrapperWidth / 2);

    // automatically shrink the dropdown to fit the screen if the screen is too small
    // this shouldn't be needed often, but seems worth keeping just in case!
    const width = Math.min(this.props.width, windowWidth - (SCREEN_MARGIN * 2));

    // if `leftOffset` is < 0, we need to shift the popup to the right
    const leftOffset = wrapperCenter - (width / 2);

    // if `rightOffset` is > 0, we need to shift the popup to the left
    const rightOffset = wrapperCenter + (width / 2) - windowWidth;

    // calculate the overall offset required to stay on-screen
    const offsetX = Math.abs(Math.min(leftOffset - SCREEN_MARGIN, 0)) - Math.abs(Math.max(rightOffset + SCREEN_MARGIN, 0));
    const offsetY = wrapperHeight - 10;

    this.setState({
      offsetX,
      offsetY,
      width
    });
  };

  componentDidMount() {
    document.documentElement.addEventListener('click', this.handleDocumentClick, false);
    document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown, false);
    window.addEventListener('resize', this.handleWindowResize, false);
    this.calculateViewportOffsets();
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.handleDocumentClick);
    document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
    window.removeEventListener('resize', this.handlewindowResize);
    this._resizeDebounceTimeout = clearTimeout(this._resizeDebounceTimeout); // just in case
  }

  handleDocumentClick = (event) => {
    const target = event.target;

    const clickWasInComponent = this.wrapperNode.contains(target);

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

  handleDocumentKeyDown = (event) => {
    // Handle the escape key
    if (this.state.showing && event.keyCode === 27) {
      this.setShowing(false);
    }
  };

  setShowing(showing) {
    this.setState({ showing: showing });

    if (this.props.onToggle) {
      this.props.onToggle(this.state.showing);
    }
  }

  renderNib() {
    const nibStyles = {};

    if (this.props.align === 'right') {
      nibStyles.right = 10;
    } else if (this.props.align === 'left') {
      nibStyles.left = 10;
    } else if (this.props.align === 'center') {
      nibStyles.left = '50%';
      nibStyles.marginLeft = -(NIB_WIDTH / 2) - this.state.offsetX + this.props.nibOffset;
    }

    return (
      <Nib
        src={require('../../images/up-pointing-white-nib.svg')}
        style={nibStyles}
        alt=""
      />
    );
  }

  renderPopup(children) {
    if (!this.state.showing) {
      return;
    }

    const offset = (this.state.width / 2) - this.state.offsetX;

    const popupStyles = {
      left: `calc(50% - ${offset}px)`,
      top: this.state.offsetY,
      transformOrigin: `${offset + this.props.nibOffset}px -15px`,
      width: this.state.width,
      zIndex: 3
    };

    if (this.props.align === 'left') {
      popupStyles.left = 3;
      popupStyles.transformOrigin = '7.5% -15px';
    }

    if (this.props.align === 'right') {
      popupStyles.right = 3;
      delete popupStyles.left;
      popupStyles.transformOrigin = '92.5% -15px';
    }

    return (
      <div
        className="absolute mt1 bg-white rounded-2 shadow border border-gray block py1 transition-popup"
        style={popupStyles}
        ref={(popupNode) => this.popupNode = popupNode}
      >
        {this.renderNib()}
        <ScrollZone>{children}</ScrollZone>
      </div>
    );
  }

  render() {
    const [firstChild, ...children] = React.Children.toArray(this.props.children);
    const wrapperClassName = classNames('relative', this.props.className);

    return (
      <span
        ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={wrapperClassName}
      >
        {firstChild}
        <ReactCSSTransitionGroup
          transitionName="transition-popup"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {this.renderPopup(children)}
        </ReactCSSTransitionGroup>
      </span>
    );
  }
}

export default Dropdown;
