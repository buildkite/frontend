import React from "react";

import Panel from "../../shared/Panel";

import { getGraphQLSchema } from "./graphql";

class GraphQLDocumentation extends React.Component {
  renderFields(fields) {
    return Object.entries(fields).map(([name, field]) => {
      console.log(name, field);

      let argumentNodes = field.args.map((arg, index) => {
        // Only include the ", " seperator between each argument (not after the
        // last one).
        let seperator;
        if (index != field.args.length && field.args.length > 1) {
          seperator = (
            <span>, </span>
          );
        }

        return (
          <span>{arg.name}: {arg.type.toString()}{seperator}</span>
        );
      });

      return (
        <div className="mb2">
          <div className="monospace mb1">{name}({argumentNodes}) {`{ ... }`}</div>
          <div className="dark-gray" style={{fontSize: 13}}>{field.description || "n/a"}</div>
        </div>
      )
    });
  }

  render() {
    const schema = getGraphQLSchema();

    return (
      <div>
        <Panel className="mb4">
          <Panel.Header>Query</Panel.Header>
          <Panel.Section>
            <p><code>query {`{ ... }`}</code> operations are "read only" within the GraphQL API. You can use these queries to read information out of the Buildkite GraphQL API.</p>
          </Panel.Section>

          <Panel.Section>{this.renderFields(schema.getQueryType().getFields())}</Panel.Section>
        </Panel>

        <Panel>
          <Panel.Header>Mutation</Panel.Header>
          <Panel.Section>{this.renderFields(schema.getMutationType().getFields())}</Panel.Section>
        </Panel>
      </div>
    );
  }
}

export default GraphQLDocumentation;
