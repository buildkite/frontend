import React from "react";
import { Link } from 'react-router';

const RowLink = (props) =>
  <div className="border-gray border-top">
    <Link to={props.to} className="btn py2 px3 flex items-center hover-bg-silver hover-black focus-black">
      <div className="flex-auto">
        {props.children}
      </div>
      <div>
        <i className="fa fa-chevron-right gray"></i>
      </div>
    </Link>
  </div>

RowLink.propTypes = {
  children: React.PropTypes.node.isRequired,
  to: React.PropTypes.string.isRequired
};

RowLink.displayName = "Panel.RowLink";

export default RowLink;
