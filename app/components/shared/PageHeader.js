import React from "react";

const PageHeader = (props) =>
  <h1 className="h1" style={{marginBottom: "20px", paddingBottom: "0px", marginTop: "0px"}}>{props.children}</h1>

PageHeader.propTypes = {
  children: React.PropTypes.node.isRequired
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
