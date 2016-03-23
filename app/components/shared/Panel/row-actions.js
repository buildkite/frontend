import React from "react";

class RowActions extends React.Component {
  static displayName = "Panel.RowActions";

  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    // Since this component is a wrapper for other components, we can't return
    // null if there aren't any children (otherwise React seems to bork).
    // Returning a <noscript> if there's nothing to render seems to do the
    // trick!
    if(children.length > 0) {
      return (
        <div className="flex items-center">
          {this.props.children}
        </div>
      );
    } else {
      return <noscript />;
    }
  }
}

export default RowActions;
