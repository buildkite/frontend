import React from "react";
import { Link } from 'react-router';

class RootField extends React.PureComponent {
  render() {
    const name = this.props.name.split(".")[1];

    return (
      <span className="cm-s-graphql monospace">
        <Link className="cm-property underline-dotted text-decoration-none" to={`/user/graphql/documentation#${this.props.name}`}>{name}</Link>
        <span className="cm-punctuation">(</span>
        <span className="cm-punctuation">)</span>
      </span>
    );
  }
}

export default RootField;
