import React from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';

class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    action: React.PropTypes.string,
    method: React.PropTypes.string,
    loading: React.PropTypes.bool,
    loadingText: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    children: React.PropTypes.node
  };

  render() {
    let classes = classNames(this.props.className, "btn");

    return (
      <button
        className={classes}
        disabled={this.props.loading}
        style={this.props.style}
        onClick={this._handleOnClick}>
        {this._contentsNode()}
        {this._formNode()}
      </button>
    );
  }

  _formNode() {
    if(this.props.action) {
      return (
        <form action={this.props.action} method="post" ref={c => this.formNode = c}>
          <input type="hidden" name="_method" value={this.props.method || "post"} />
          <input type="hidden" ref={c => this.csrfNode = c} />
        </form>
      );
    }
  }

  _contentsNode() {
    if(this.props.loading) {
      return (
        <span>
          <i className="fa fa-spinner fa-spin"></i> {this.props.loadingText}
        </span>
      )
    } else {
      return this.props.children;
    }
  }

  _handleOnClick = (e) => {
    if(this.props.onClick) {
      // If an onClick returns false, cancel out the rest of thie _handleOnClick method.
      if(this.props.onClick(e) === false) {
        return null;
      }
    }

    if(this.props.action) {
      // Need to set the CSRF token since we're doing a form post
      let csrfElement = ReactDOM.findDOMNode(this.csrfNode)
      csrfElement.name = window._csrf.param
      csrfElement.value = window._csrf.token

      ReactDOM.findDOMNode(this.formNode).submit()
    }
  };
}

export default Button
