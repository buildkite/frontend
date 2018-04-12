// @flow

import React from "react";

import RootField from "./GraphQLExplorerDocumentation/RootField";
import { getGraphQLSchema } from "./schema";

type Props = {
  params: {
    field: string
  }
};

export default class GraphQLExplorerDocumentationQuery extends React.PureComponent<Props> {
  render() {
    const fieldname = this.props.params.field;
    const schema = getGraphQLSchema();
    const field = schema.getQueryType().getFields()[fieldname];

    console.log(field);

    return (
      <div>
        <h2>Query: <RootField name={`query.${fieldname}`} /></h2>
        {field.isDeprecated && <p>This query is deprecated. {field.deprecationReason}</p>}
        <p>{field.description || 'No description available.'}</p>
        <h3>Arguments</h3>
        <h3>Returns</h3>
        <pre>{JSON.stringify(field, null, '  ')}</pre>
      </div>
    );
  }
}
