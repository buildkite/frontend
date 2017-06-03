import React from 'react';
import PropTypes from 'prop-types';

export default class Link extends React.PureComponent {
  static displayName = "Footer.Link";

  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <a href={this.props.href} className={`btn semi-bold hover-lime`}>{this.props.children}</a>
    );
  }
}
