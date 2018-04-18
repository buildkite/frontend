// @flow

import React from "react";

type Props = {
  name: string
};

export default class Argument extends React.PureComponent<Props> {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-attribute">{this.props.name}</span>
      </span>
    );
  }
}
