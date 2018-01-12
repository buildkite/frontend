import React from "react";
import DocumentTitle from "react-document-title";

import PageHeader from "../../shared/PageHeader";
import TabControl from "../../shared/TabControl";
import Spinner from "../../shared/Spinner";

import { fetchAndBuildGraphQLSchema } from "./graphql";

class GraphQLExplorer extends React.Component {
  state = {
    schemaLoaded: null,
    schemaError: null
  };

  componentDidMount() {
    // Even though we don't use the schema for anything in here, we're just
    // preloading it so when the console loads it doesn't have to do anything.
    fetchAndBuildGraphQLSchema().then(() => {
      this.setState({ schemaLoaded: true });
    }).catch((error) => {
      this.setState({ schemaError: error });
    });
  }

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

          {this.renderContent()}
        </div>
      </DocumentTitle>
    );
  }

  renderContent() {
    if (this.state.schemaError) {
      return (
        <div className="flex items-center justify-center" style={{height: 300}}>
          <span className="red">There was an error loading the GraphQL Schema. Please try again.</span>
        </div>
      )
    }

    if (!this.state.schemaLoaded) {
      return (
        <div className="flex items-center justify-center" style={{height: 300}}>
          <Spinner className="mr1" /> <span className="dark-gray">Loading GraphQL Console…</span>
        </div>
      )
    }

    return (
      <div>
        <TabControl>
          <TabControl.Tab to={`/user/graphql/console`}>Console</TabControl.Tab>
          <TabControl.Tab to={`/user/graphql/documentation`}>Documentation</TabControl.Tab>
          <TabControl.Tab to={`/user/graphql/examples`}>Examples</TabControl.Tab>
        </TabControl>

        {this.props.children}
      </div>
    )
  }
}

export default GraphQLExplorer;
