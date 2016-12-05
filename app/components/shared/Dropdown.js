import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styled from 'styled-components';

const MOBILE_BREAKPOINT = '(min-width: 768px)'; // same as --breakpoint-sm-md

const Wrapper = styled.span`
  @media ${MOBILE_BREAKPOINT} {
    position: relative;
  }
`;

const Popup = styled.div`
  top: 35px;
  z-index: 3;
  left: 0;
  right: 0;
  transform-origin: ${
    (props) => {
      switch (props.align) {
        case 'left':
          return '7.5% -15px';
        case 'right':
          return '92.5% -15px';
        default:
        case 'center':
          return '42.5% -15px';
      }
    }
  };
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media ${MOBILE_BREAKPOINT} {
    width: ${(props) => `${props.width}px`};
    left: ${
      (props) => {
        switch (props.align) {
          case 'left':
            return '3px';
          case 'center':
            return `calc(50% - ${props.width / 2}px)`;
          default:
          case 'right':
            return 'auto';
        }
      }
    };
    right: ${
      (props) => (
        props.align === 'right'
          ? '3px'
          : 'auto'
      )
    };

    &:before {
      content: '';
      position: absolute;
      top: -20px;
      width: 32px;
      height: 20px;
      z-index: 3;
      background-image: url(${require('../../images/up-pointing-white-nib.svg')});

      left: ${
        (props) => (
          props.align === 'left'
            ? '10px'
            : (
              props.align === 'center'
                ? '50%'
                : 'auto'
            )
        )
      };
      right: ${
        (props) => (
          props.align === 'right'
            ? '10px'
            : 'auto'
        )
      };
      margin-left: ${
        (props) => (
          props.align === 'center'
            ? `${-16 + props.nibOffset}px`
            : '0'
        )
      };
    }
  }
`;

Popup.defaultProps = {
  className: "absolute mt1 bg-white rounded-2 shadow border border-gray block py1 transition-popup"
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
    nibOffset: 0
  };

  state = {
    showing: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    document.documentElement.addEventListener('click', this.handleDocumentClick, false);
    document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown, false);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.handleDocumentClick);
    document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
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

  render() {
    const [firstChild, ...children] = React.Children.toArray(this.props.children);

    return (
      <Wrapper
        align={this.props.align}
        nibOffset={this.props.nibOffset}
        width={this.props.width}
        innerRef={(wrapperNode) => this.wrapperNode = wrapperNode}
        className={this.props.className}
      >
        {firstChild}
        <ReactCSSTransitionGroup
          transitionName="transition-popup"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {
            this.state.showing &&
              <Popup
                align={this.props.align}
                nibOffset={this.props.nibOffset}
                width={this.props.width}
                innerRef={(popupNode) => this.popupNode = popupNode}
              >
                {children}
              </Popup>
          }
        </ReactCSSTransitionGroup>
      </Wrapper>
    );
  }
}

export default Dropdown;
