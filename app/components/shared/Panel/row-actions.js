import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

export default class RowActions extends React.Component {
  static displayName = "Panel.RowActions";

  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

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
