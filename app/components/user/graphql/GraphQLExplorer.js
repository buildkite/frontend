// @flow

import React from "react";
import DocumentTitle from "react-document-title";

import PageHeader from "../../shared/PageHeader";
import TabControl from "../../shared/TabControl";
import Icon from "../../shared/Icon";

type Props = {
  children: React$Node
};

class GraphQLExplorer extends React.PureComponent<Props> {
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
              GraphQL Explorer
            </PageHeader.Title>
            <PageHeader.Description>
              Interact with the Buildkite GraphQL API right in your browser. This is production data you’re playing with, so take care!
            </PageHeader.Description>
          </PageHeader>

          <div>
            <TabControl>
              <TabControl.Tab to={`/user/graphql/console`}>Console</TabControl.Tab>
            </TabControl>

            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default GraphQLExplorer;
