import React from "react";

import Any from "./any";
import Only from "./only";

class Permissions extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    permissions: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  };

  static childContextTypes = {
    permissions: React.PropTypes.object
  };

  componentDidUpdate() {
    // This doesn't need to be here, but otherwise eslint thinks this should be
    // a pure stateless function (but we use getChildContext, so it can't be).
  }

  getChildContext() {
    return { permissions: this.props.permissions };
  }

  render() {
    // Ideally we wouldn't need to return a div here, but we can't return an
    // array from a React component, so this will have to do.
    return (
      <section className={this.props.className}>
        {this.props.children}
      </section>
    )
  }
}

Permissions.Any = Any;
Permissions.Only = Only;

export default Permissions;
