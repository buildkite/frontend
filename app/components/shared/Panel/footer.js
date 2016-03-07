import React from "react";

class Footer extends React.Component {
  static displayName = "Panel.Footer";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="border-top border-gray py2 px3">
        {this.props.children}
      </div>
    );
  }
}

export default Footer;
