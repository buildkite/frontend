import React from 'react';
import PropTypes from 'prop-types';

import BaseButton from '../Button';

export default class Button extends React.PureComponent {
  static displayName = "PageHeader.Button";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <BaseButton {...this.props} theme="default" outline={true} className="ml1">{this.props.children}</BaseButton>
    );
  }
}
