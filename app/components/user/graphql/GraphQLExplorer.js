import React from "react";
import DocumentTitle from "react-document-title";

import PageHeader from "../../shared/PageHeader";
import TabControl from "../../shared/TabControl";

class GraphQLExplorer extends React.Component {
  render() {
    return (
      <DocumentTitle title={`GraphQL Console`}>
        <div className="container">
          <PageHeader>
            <PageHeader.Title>
              Buildkite GraphQL API Console
            </PageHeader.Title>
            <PageHeader.Description>
              Explore the Buildkite GraphQL API right in your browser.
            </PageHeader.Description>
          </PageHeader>

          <TabControl>
            <TabControl.Tab to={`/user/graphql/console`}>Console</TabControl.Tab>
            <TabControl.Tab to={`/user/graphql/documentation`}>Documentation</TabControl.Tab>
            <TabControl.Tab to={`/user/graphql/examples`}>Examples</TabControl.Tab>
          </TabControl>

          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }
}

export default GraphQLExplorer;
