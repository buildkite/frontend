import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Icon from './Icon';

class Dialog extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    children: React.PropTypes.node
  };

  state = {
    rendered: false,
    visible: false
  };

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

  render() {
    if (this.state.rendered) {
      return (
        <span className="block fixed flex items-center justify-center" style={{ top: 0, left: 0, bottom: 0, right: 0, zIndex: 1000 }}>
          <ReactCSSTransitionGroup transitionName="transition-slide-up" transitionEnterTimeout={150} transitionLeaveTimeout={300}>
            {this.renderDialog()}
          </ReactCSSTransitionGroup>
          {this.renderBackdrop()}
        </span>
      );
    } else {
      return null;
    }
  }

  renderBackdrop() {
    if (this.state.visible) {
      return (
        <div className="absolute bg-white" style={{ top: 0, left: 0, bottom: 0, right: 0, opacity: 0.9, zIndex: 1001 }} />
      );
    }
  }

  renderDialog() {
    if (this.state.visible) {
      return  (
        <div
          className="background bg-white transition-popup rounded-3 shadow-subtle center relative mx4"
          style={{ padding: "50px 10px", width: 500, zIndex: 1002, maxWidth: '90vw' }}
        >
          <button className="btn absolute circle shadow-subtle bg-white bold flex items-center border border-white p0" style={{ top: -15, right: -15, width: 30, height: 30 }} onClick={this.handleCloseClick}>
            <Icon className="mx-auto" icon="close" title="Close" />
          </button>

          {this.props.children}
        </div>
      );
    }
  }

  handleCloseClick = (event) => {
    event.preventDefault();

    this.props.onRequestClose();
  };

  handleDocumentKeyDown = (event) => {
    // Close the dialog on hitting the escape key
    if (this.state.visible && event.keyCode === 27) {
      event.preventDefault();

      this.props.onRequestClose();
    }
  };
}

export default Dialog;
