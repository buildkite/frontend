import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Icon from '../../shared/Icon';

export default class RowLink extends React.PureComponent {
  static displayName = "Panel.RowLink";

  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    href: PropTypes.string
  };

  render() {
    if (this.props.to) {
      return (
        <Link to={this.props.to} className="btn py2 px3 flex items-center hover-bg-silver hover-black focus-black">
          <div className="flex-auto">
            {this.props.children}
          </div>
          <Icon icon="chevron-right" className="flex-none dark-gray" style={{ height: 15, width: 15 }} />
        </Link>
      );
    } else {
      return (
        <a href={this.props.href} className="btn py2 px3 flex items-center hover-bg-silver hover-black focus-black">
          <div className="flex-auto">
            {this.props.children}
          </div>
          <Icon icon="chevron-right" className="flex-none dark-gray" style={{ height: 15, width: 15 }} />
        </a>
      );
    }
  }
}
