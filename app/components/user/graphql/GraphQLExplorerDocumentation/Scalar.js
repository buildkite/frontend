// @flow

import React from "react";

type Props = {
  name: string
};

export default class Scalar extends React.PureComponent<Props> {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-atom">{this.props.name}</span>
      </span>
    );
  }
}
