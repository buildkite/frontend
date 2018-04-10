import React from "react";

import GraphQLExplorerDocumentationHome from "./GraphQLExplorerDocumentationHome";
import GraphQLExplorerDocumentationQuery from "./GraphQLExplorerDocumentationQuery";
import GraphQLExplorerDocumentationMutation from "./GraphQLExplorerDocumentationMutation";

class GraphQLExplorerDocumentation extends React.PureComponent {
  render() {
    if (this.props.location.hash) {
      const parts = this.props.location.hash.split(".");

      if (parts[0] == "#query") {
        return (
          <GraphQLExplorerDocumentationQuery field={parts[1]} />
        );
      } else if (parts[1] == "#mutation") {
        return (
          <GraphQLExplorerDocumentationMutation field={parts[1]} />
        );
      }
    }

    return (
      <GraphQLExplorerDocumentationHome />
    );
  }
}

export default GraphQLExplorerDocumentation;
