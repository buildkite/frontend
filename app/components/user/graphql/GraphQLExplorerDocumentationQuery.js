// @flow

import React from "react";

import RootField from "./GraphQLExplorerDocumentation/RootField";
import { getGraphQLSchema } from "./schema";

type Props = {
  params: {
    field: string
  }
};

class GraphQLExplorerDocumentationQuery extends React.PureComponent<Props> {
  render() {
    const schema = getGraphQLSchema();
    const field = schema.getQueryType().getFields()[this.props.params.field];

    console.log(field);

    return (
      <div>
        <h2>Query: <RootField name={`query.${this.props.params.field}`} /></h2>
      </div>
    );
  }
}

export default GraphQLExplorerDocumentationQuery;
