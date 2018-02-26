import React from "react";
import wrap from "word-wrap";

class Comment extends React.PureComponent {
  render() {
    return (
      <div className="cm-comment" style={{ whiteSpace: "pre" }}>
        {wrap(this.props.text || "n/a", { width: 70, indent: "# ", newline: "\n# " })}
      </div>
    );
  }
}

export default Comment;
