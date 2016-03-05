import React from "react";
import ReactDOM from "react-dom";
import update from "react-addons-update";
import classNames from "classnames";
import { Link } from 'react-router';

const THEMES = {
  outline: "btn-outline",
  primary: "btn-primary nowrap",
  success: "btn-primar bg-green nowrap",
  warning: "btn-primary bg-orange nowrap",
  error: "btn-primary bg-red nowrap"
};

class Button extends React.Component {
  static propTypes = {
    loading: React.PropTypes.string,
    theme: React.PropTypes.oneOf([
      'primary',
      'success',
      'warning',
      'error',
      false
    ])
  };

  static defaultProps = {
    theme: 'primary'
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  render() {
    // Merge the "btn" class onto the props, and toggle the disabled state
    // depending on whether or not this button is in it's "loading" state.
    let props = update(this.props, {
      className: {
        $set: classNames(this.props.className, "btn", THEMES[this.props.theme], { "is-disabled": !!this.props.loading })
      },
      disabled: {
        $set: !!this.props.loading
      }
    });

    // If we've defined a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if(props.link && this.context.router) {
      return (
	<Link to={props.link} {...props}>{this._contentsNode()}</Link>
      );
    } else {
      let tag = props.href ? 'a' : 'button';

      return React.DOM[tag](props, this._contentsNode())
    }
  }

  _contentsNode() {
    if(this.props.loading) {
      return (
        <span>
          <i className="fa fa-spinner fa-spin"></i> {this.props.loading}
        </span>
      )
    } else {
      return this.props.children;
    }
  }
}

export default Button
