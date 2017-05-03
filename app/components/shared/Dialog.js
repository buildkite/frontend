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
  className: 'absolute circle shadow-subtle bg-white bold flex items-center cursor-pointer border border-white p0 hover-lime focus-lime'
};

const DialogBackdrop = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.9;
`;

DialogBackdrop.defaultProps = {
  className: 'absolute bg-white'
};

const DialogContainer = styled.div`
  width: 100vw;
  maxWidth: 100%;
  height: 100%;
  padding: 25px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &:after {
    display: block;
    flex: 0 0 auto;
    height: 40px;
    content: '';
  }
`;
// NOTE: DialogContainer:after is a substitute for padding
// which would otherwise be applied, but is ignored by both
// Firefox and Safari!

DialogContainer.defaultProps = {
  className: 'flex flex-column'
};

const DialogBox = styled.div`
  width: 100%;
  maxWidth: ${(props) => props.width}px;
  margin: auto;
`;

DialogBox.defaultProps = {
  className: 'background bg-white rounded-3 shadow-subtle relative'
};

const DialogWrapper = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

DialogWrapper.defaultProps = {
  className: 'fixed'
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
      <DialogContainer>
        <DialogBox width={this.props.width}>
          {this.renderCloseButton()}
          {this.props.children}
        </DialogBox>
      </DialogContainer>
    );
  }

  render() {
    if (!this.state.rendered) {
      return null;
    }

    return (
      <DialogWrapper>
        {this.renderBackdrop()}
        <ReactCSSTransitionGroup transitionName="transition-slide-up" transitionEnterTimeout={150} transitionLeaveTimeout={300}>
          {this.renderDialog()}
        </ReactCSSTransitionGroup>
      </DialogWrapper>
    );
  }
}

export default Dialog;
