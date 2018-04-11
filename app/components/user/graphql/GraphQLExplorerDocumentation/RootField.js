// @flow

import React from "react";
import { Link } from 'react-router';

type Props = {
  name: string
};

export default class RootField extends React.PureComponent<Props> {
  render() {
    const [type, name] = this.props.name.split(".");

    return (
      <span className="cm-s-graphql monospace">
        <Link className="cm-property underline-dotted text-decoration-none" to={`/user/graphql/documentation/${type}/${name}`}>{name}</Link>
        <span className="cm-punctuation">(</span>
        <span className="cm-punctuation">)</span>
      </span>
    );
  }
}
