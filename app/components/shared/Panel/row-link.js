import React from "react";
import { Link } from 'react-router';

const RowLink = (props) =>
  <Link to={props.to} className="border-top block py2 px3 hover-no-underline flex flex-center">
    <div className="flex-auto">
      {props.children}
    </div>
    <div>
      <i className="fa fa-chevron-right gray"></i>
    </div>
  </Link>

RowLink.propTypes = {
  children: React.PropTypes.node.isRequired,
  to: React.PropTypes.string.isRequired
};

RowLink.displayName = "Panel.RowLink";

export default RowLink;
