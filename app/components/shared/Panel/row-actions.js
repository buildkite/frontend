import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class RowActions extends React.PureComponent {
  static displayName = "Panel.RowActions";

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const children = React.Children.toArray(this.props.children);

    // Since this component is a wrapper for other components, we can't return
    // null if there aren't any children (otherwise React seems to bork).
    // Returning a <noscript> if there's nothing to render seems to do the
    // trick!
    if (children.length > 0) {
      return (
        <div className={classNames('flex items-center', this.props.className)}>
          {this.props.children}
        </div>
      );
    } else {
      return <noscript />;
    }
  }
}
