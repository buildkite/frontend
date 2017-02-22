import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styled from 'styled-components';

import Icon from './Icon';

const BUTTON_SIZE = 30;

const CloseButton = styled.button`
  top: ${-BUTTON_SIZE / 2}px;
  right: ${-BUTTON_SIZE / 2}px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;

  &:focus {
    outline: none;
  }
`;

CloseButton.defaultProps = {
  className: 'absolute circle shadow-subtle bg-white bold flex items-center cursor-pointer border border-white p0'
};

const DialogBackdrop = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.9;
  z-index: 1001;
`;

DialogBackdrop.defaultProps = {
  className: 'absolute bg-white'
};

const DialogBox = styled.div`
  width: ${(props) => props.width}px;
  zIndex: 1002;
  maxWidth: 90vw;
`;

DialogBox.defaultProps = {
  className: 'background bg-white transition-popup rounded-3 shadow-subtle relative mx4'
};

const DialogContainer = styled.span`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

DialogContainer.defaultProps = {
  className: 'block fixed flex items-center justify-center'
};

class Dialog extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    closeable: React.PropTypes.bool,
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    width: React.PropTypes.number
  };

  static defaultProps = {
    closeable: true,
    isOpen: false,
    width: 500
  };

  constructor(initialProps) {
    super(initialProps);

    let rendered = false;
    let visible = false;

    if (initialProps.isOpen) {
      rendered = visible = true;
    }

    this.state = {
      rendered,
      visible
    };
  }

  componentDidMount() {
    document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown, false);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    // Opening the dialog
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ rendered: true }, () => {
        this.setState({ visible: true });
      });
    }

    // Closing the dialog
    if (this.props.isOpen && !nextProps.isOpen) {
      this.setState({ visible: false }, () => {
        // Give the animation some time to finish, then remove the dialog from
        // the DOM
        setTimeout(() => {
          this.setState({ rendered: false });
        }, 150);
      });
    }
  }

  maybeClose = (event) => {
    event.preventDefault();
    if (typeof this.props.onRequestClose === 'function') {
      this.props.onRequestClose();
    }
  };

  handleCloseClick = (event) => {
    this.maybeClose(event);
  };

  handleDocumentKeyDown = (event) => {
    // Close the dialog on hitting the escape key
    if (this.state.visible && event.keyCode === 27) {
      this.maybeClose(event);
    }
  };

  renderBackdrop() {
    if (!this.state.visible) {
      return;
    }

    return <DialogBackdrop />;
  }

  renderCloseButton() {
    if (!this.props.closeable) {
      return;
    }

    return (
      <CloseButton onClick={this.handleCloseClick}>
        <Icon className="mx-auto" icon="close" title="Close" />
      </CloseButton>
    );
  }

  renderDialog() {
    if (!this.state.visible) {
      return;
    }

    return (
      <DialogBox width={this.props.width}>
        {this.renderCloseButton()}
        {this.props.children}
      </DialogBox>
    );
  }

  render() {
    if (!this.state.rendered) {
      return null;
    }

    return (
      <DialogContainer>
        <ReactCSSTransitionGroup transitionName="transition-slide-up" transitionEnterTimeout={150} transitionLeaveTimeout={300}>
          {this.renderDialog()}
        </ReactCSSTransitionGroup>
        {this.renderBackdrop()}
      </DialogContainer>
    );
  }
}

export default Dialog;
