import React from "react";
import { Link } from 'react-router';

class RootField extends React.PureComponent {
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

export default RootField;
