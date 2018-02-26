// @flow

import React from "react";
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from "react-relay/compat";

import Button from "../../shared/Button";

import GraphQLExplorerConsoleEditor from "./GraphQLExplorerConsoleEditor";
import GraphQLExplorerConsoleResultsViewer from "./GraphQLExplorerConsoleResultsViewer";

import { getCurrentQuery, setCurrentQuery, interpolateQuery } from "./query";
import { getCachedResults, setCachedResults } from "./results";
import { executeGraphQLQuery } from "./network";

import { DEFAULT_QUERY_WITH_ORGANIZATION, DEFAULT_QUERY_NO_ORGANIZATION } from "./defaults";

class GraphQLExplorerConsole extends React.PureComponent {
  state = {
    performance: null,
    results: null,
    executing: false,
    executedFirstQuery: false
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    // Let the component know that we've already executed a query and we'll
    // just be showing that instead.
    const cachedResults = getCachedResults();
    if (cachedResults) {
      this.state = {
        executedFirstQuery: true,
        results: cachedResults.results,
        performance: cachedResults.performance
      };
    }
  }

  executeCurrentQuery() {
    this.setState({ executing: true });

    executeGraphQLQuery({ query: this.getCurrentQuery() }).then((response) => {
      // Once we've got the resposne back, and converted it JSON
      response.json().then((json) => {
        // Now that we've got back some real JSON, let's turn it back into a
        // string... The things we do to make it look pretty! (The 2 means
        // indent each nested object with 2 spaces)
        const prettyJSONString = JSON.stringify(json, null, 2);

        // Get performance information out of the query if there is any.
        const responsePerformanceInformation = response.headers.get('x-buildkite-performance');

        // Also store the pretty JSON in the results cache so next time we
        // re-render the component we can show the previous results. Makes for
        // great tab switching!
        setCachedResults(prettyJSONString, responsePerformanceInformation);

        // Tell the console we're not executing anymore, and that it can stop
        // showing a spinner.
        this.setState({
          results: prettyJSONString,
          performance: responsePerformanceInformation,
          executing: false,
          executedFirstQuery: true
        });
      });
    });
  }

  getCurrentQuery() {
    let query = getCurrentQuery();

    // If there isn't a query currently in local storage, let's make up one
    // based on one of the examples.
    if (!query) {
      // If we've got an organization loaded, let's use the default query that
      // looks at the first organization. If the user isn't part of any
      // organization, we'll use the default that doesn't retrieve organization
      // information.
      if (this.props.viewer.organizations.edges.length) {
        query = interpolateQuery(DEFAULT_QUERY_WITH_ORGANIZATION, {
          organization: this.props.viewer.organizations.edges[0].node
        });
      } else {
        query = DEFAULT_QUERY_NO_ORGANIZATION;
      }
    }

    return query;
  }

  render() {
    return (
      <div>
        <div className="mb3">
          <Button onClick={this.handleExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
        </div>

        <div className="flex flex-fit border border-gray rounded" style={{ width: "100%" }}>
          <div className="col-6" style={{ minHeight: 500 }}>
            <GraphQLExplorerConsoleEditor value={this.getCurrentQuery()} onChange={this.handleEditorChange} />
          </div>

          <div className="col-6 border-left border-gray">
            <div className="relative flex flex-wrap items-stretch" style={{ height: "100%", width: "100%" }}>
              {this.renderOutputPanel()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOutputPanel() {
    if (!this.state.executedFirstQuery) {
      return (
        <div className="flex items-center justify-center absolute" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
          <span>Hit the <span className="semi-bold">Execute</span> above button to run this query! ☝️ </span>
        </div>
      );
    }
    return (
      <React.Fragment>
        <GraphQLExplorerConsoleResultsViewer results={this.state.results} className="p1 flex-auto" style={{ width: "100%" }} />
        {this.renderDebuggingInformation()}
      </React.Fragment>
    );

  }

  renderDebuggingInformation() {
    // Only render debugging information if we've got some to show, and we're
    // in "debug" mode.
    if (this.state.performance && this.context.router.location.query["debug"] === "true") {
      return (
        <div className="px3 py2 border-top border-gray bg-silver col-12 flex-none">
          <div className="bold black mb1">Performance 🚀</div>
          <pre className="monospace" style={{ fontSize: 12 }}>{this.state.performance.split("; ").join("\n")}</pre>
        </div>
      );
    }
  }

  handleExecuteClick = () => {
    event.preventDefault();
    this.executeCurrentQuery();
  };

  handleEditorChange = (value) => {
    setCurrentQuery(value);
  };
}

export default createFragmentContainer(GraphQLExplorerConsole, {
  viewer: graphql`
    fragment GraphQLExplorerConsole_viewer on Viewer {
      organizations(first: 100) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
`
});
