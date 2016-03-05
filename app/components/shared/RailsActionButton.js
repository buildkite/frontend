import React from "react";

import Button from "./Button";

class RailsActionButton extends React.Component {
  static propTypes = {
    action: React.PropTypes.string,
    method: React.PropTypes.string
  };

  render() {
    return (
      <Button onClick={this._handleOnClick} {...this.props}>
        {this.props.children}
        <form action={this.props.action} method="post" ref={c => this.formNode = c}>
          <input type="hidden" name="_method" value={this.props.method || "post"} />
          <input type="hidden" ref={c => this.csrfNode = c} />
        </form>
      </Button>
    );
  }

  _handleOnClick = (e) => {
    // Need to set the CSRF token since we're doing a form post
    let csrfElement = ReactDOM.findDOMNode(this.csrfNode)
    csrfElement.name = window._csrf.param
    csrfElement.value = window._csrf.token

    ReactDOM.findDOMNode(this.formNode).submit()
  };
}

export default Button
