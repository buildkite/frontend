import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Title extends React.Component {
  static displayName = "PageHeader.Title";

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    return (
      <h1 className={classNames('h1 m0 p0', this.props.className)}>
        {this.props.children}
      </h1>
    );
  }
}

export default Title;
