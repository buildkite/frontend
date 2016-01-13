import React from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';

class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    action: React.PropTypes.string,
    method: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    let classes = classNames(this.props.className, "btn");

    return (
      <button className={classes}
              disabled={this.props.loading}
              style={this.props.style}
              onClick={this._handleOnClick.bind(this)}>{this._contentsNode()}{this._formNode()}</button>
    );
  }

  _formNode() {
    if(this.props.action) {
      return (
        <form action={this.props.action} method="post" ref="form">
          <input type="hidden" name="_method" value={this.props.method || "post"} />
          <input type="hidden" ref="csrf" />
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

  _handleOnClick(e) {
    if(this.props.onClick) {
      // If an onClick returns false, cancel out the rest of thie _handleOnClick method.
      if(this.props.onClick(e) === false) {
        return null;
      }
    }

    if(this.props.action) {
      // Need to set the CSRF token since we're doing a form post
      let csrfNode = ReactDOM.findDOMNode(this.refs['csrf'])
      csrfNode.name = window._csrf.param
      csrfNode.value = window._csrf.token

      ReactDOM.findDOMNode(this.refs['form']).submit()
    }
  }
}

export default Button
