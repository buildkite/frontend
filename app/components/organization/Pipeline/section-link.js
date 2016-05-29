import React from 'react';
import classNames from 'classnames';

class SectionLink extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    href: React.PropTypes.string,
    style: React.PropTypes.object,
    children: React.PropTypes.node.isRequired
  };

  render() {
    let classes = classNames(this.props.className, {
      "text-decoration-none color-inherit": !!this.props.href
    });

    return (
      <a href={this.props.href} className={classes} style={this.props.style}>
        {this.props.children}
      </a>
    );
  }
}

export default SectionLink
