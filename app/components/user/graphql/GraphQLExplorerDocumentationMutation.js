import React from "react";

class GraphQLExplorerDocumentationMutation extends React.PureComponent {
  render() {
    return (
      <div>Zomg Mutation! {this.props.params.field}</div>
    );
  }
}

export default GraphQLExplorerDocumentationMutation;
