// @flow

import React from "react";

import RootField from "./GraphQLExplorerDocumentation/RootField";
import { getGraphQLSchema } from "./schema";

type Props = {
  params: {
    field: string
  }
};

export default class GraphQLExplorerDocumentationMutation extends React.PureComponent<Props> {
  render() {
    const fieldname = this.props.params.field;
    const schema = getGraphQLSchema();
    const field = schema.getMutationType().getFields()[fieldname];

    console.log(field);

    return (
      <div>
        <h2>Mutation: <RootField name={`mutation.${fieldname}`} /></h2>
        {field.isDeprecated && <p>This mutation is deprecated. {field.deprecationReason}</p>}
        <p>{field.description || 'No description available.'}</p>
        <pre>{JSON.stringify(field, null, '  ')}</pre>
      </div>
    );
  }
}
