import React from "react";

class PageHeader extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <h1 className="h1" style={{marginBottom: "20px", paddingBottom: "0px", marginTop: "0px"}}>{this.props.children}</h1>
    );
  }
}

export default PageHeader;
