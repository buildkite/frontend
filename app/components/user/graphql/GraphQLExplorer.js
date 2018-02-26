// @flow

import React from "react";
import DocumentTitle from "react-document-title";

import PageHeader from "../../shared/PageHeader";
import TabControl from "../../shared/TabControl";
import Icon from "../../shared/Icon";
import Spinner from "../../shared/Spinner";

import { fetchAndBuildGraphQLSchema } from "./graphql";

type Props = {
  children: React$Node
};

type State = {
  schemaLoaded: boolean,
  loadingIsSlow: boolean,
  schemaError: string
}

const MIN_HEIGHT = 300;

class GraphQLExplorer extends React.PureComponent<Props, State> {
  state = {
    schemaLoaded: false,
    loadingIsSlow: false,
    schemaError: null
  };

  componentDidMount() {
    // Even though we don't use the schema for anything in here, we're just
    // preloading it so when the childen load, they dont have to do anything.
    fetchAndBuildGraphQLSchema().then(() => {
      this.setState({ schemaLoaded: true });
    }).catch((error) => {
      this.setState({ schemaError: error });
    });

    // After a few moments, set `loadingIsSlow` to true. If we're still loading
    // things at this point, the spinner will show up. We don't need/want to
    // show the spinner if the dependencies have been loaded in from the cache
    // right away.
    setTimeout(() => {
      this.setState({ loadingIsSlow: true });
    }, 1000);
  }

  render() {
    return (
      <DocumentTitle title={`GraphQL Console`}>
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="graphql"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Buildkite GraphQL Explorer
            </PageHeader.Title>
            <PageHeader.Description>
              Interact with the Buildkite GraphQL API right in your browser. This is production data you’re playing with, so take care!
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
	<div className="flex items-center justify-center" style={{ minHeight: MIN_HEIGHT }}>
	  <span className="red">There was an error loading the GraphQL Schema. Please try again.</span>
	</div>
      );
    }

    if (!this.state.schemaLoaded) {
      if (this.state.loadingIsSlow) {
        return (
          <div className="flex items-center justify-center" style={{ minHeight: MIN_HEIGHT }}>
            <Spinner className="mr1" /> Loading GraphQL Explorer…
          </div>
        );
      } else {
        return (
          <div style={{ minHeight: MIN_HEIGHT }}>&nbsp;</div>
        )
      }
    }

    return (
      <div style={{ minHeight: MIN_HEIGHT }}>
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
