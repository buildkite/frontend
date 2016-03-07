import React from 'react';

let COLOR = (Features.NewNav == undefined || Features.NewNav == true) ? "lime" : "blue";

class Link extends React.Component {
  static displayName = "Footer.Link";

  static propTypes = {
    href: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <a href={this.props.href} className={`btn semi-bold hover-${COLOR}`}>{this.props.children}</a>
    );
  }
}

export default Link;
