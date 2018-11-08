// @flow

import React from "react";
import wrap from "word-wrap";

type Props = {
  text: string
};

export default class Comment extends React.PureComponent<Props> {
  render() {
    return (
      <div className="cm-comment" style={{ whiteSpace: "pre" }}>
        {wrap(this.props.text || "n/a", { width: 70, indent: '' }).replace(/(^|\n)/g, "$1# ")}
      </div>
    );
  }
}
