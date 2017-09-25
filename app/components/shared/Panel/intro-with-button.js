// @flow

import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  children: React$Node
};

export default class IntroWithButton extends React.PureComponent<Props> {
  static displayName = "Panel.IntroWithButton";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const children = React.Children.toArray(this.props.children);

    let intro;
    let button;
    if (children.length === 1) {
      intro = children;
    } else {
      button = children.pop();
      intro = children;
    }

    if (button) {
      button = (
        <div className="ml3 flex-none">
          {button}
        </div>
      );
    }

    return (
      <div className="py3 px3 flex">
        <div className="flex flex-auto items-center">{intro}</div>
        {button}
      </div>
    );
  }
}
