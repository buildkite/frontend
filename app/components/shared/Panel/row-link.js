import React from "react";
import { Link } from 'react-router';

import Icon from '../../shared/Icon';

class RowLink extends React.Component {
  static displayName = "Panel.RowLink";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    to: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <Link to={this.props.to} className="btn p0 flex items-center hover-bg-silver hover-black focus-black">
        <div className="flex-auto py2 px3">
          {this.props.children}
        </div>
        <div>
          <Icon icon="chevron-right" className="dark-gray mr3" style={{height: 12, width: 12}} />
        </div>
      </Link>
    );
  }
}

export default RowLink;
