import React from "react";
import { Link } from 'react-router';

class RowLink extends React.Component {
  static displayName = "Panel.RowLink";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    to: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="border-gray border-top">
        <Link to={this.props.to} className="btn py2 px3 flex items-center hover-bg-silver hover-black focus-black">
          <div className="flex-auto">
            {this.props.children}
          </div>
          <div>
            <i className="fa fa-chevron-right gray"></i>
          </div>
        </Link>
      </div>
    );
  }
}

export default RowLink;
