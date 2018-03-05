// @flow

import * as React from "react";
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from "react-relay/compat";

import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";

import GraphQLExplorerConsoleEditor from "./GraphQLExplorerConsoleEditor";
import GraphQLExplorerConsoleResultsViewer from "./GraphQLExplorerConsoleResultsViewer";

import { interpolateQuery, executeQuery, findQueryOperationNames } from "./query";
import { getQueryCache, setQueryCache, getResultsCache, setResultsCache } from "./cache";
import { DEFAULT_QUERY_WITH_ORGANIZATION, DEFAULT_QUERY_NO_ORGANIZATION } from "./defaults";
import consoleState from "./consoleState";

type OrganizationEdge = {
  node: {
    id: string,
    name: string,
    slug: string
  }
};

type Props = {
  viewer: {
    organizations: {
      edges: Array<OrganizationEdge>
    }
  }
};

type State = {
  performance?: string,
  results?: string,
  executing: boolean,
  executedFirstQuery: boolean,
  operationNames?: Array<string>,
  currentOperationName?: string
};

class GraphQLExplorerConsole extends React.PureComponent<Props, State> {
  state = {
    executing: false,
    executedFirstQuery: false,
    operationNames: null,
    currentOperationName: null
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    consoleState.setOrganizationEdges(this.props.viewer.organizations.edges);
    this.state = consoleState.toStateObject();
  }

  executeCurrentQuery() {
    this.setState({ executing: true });

    const payload = {
      query: this.state.query,
      operationName: this.state.currentOperationName
    }

    executeQuery(payload).then((response) => {
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
        this.setState(
          consoleState.setResults(prettyJSONString, responsePerformanceInformation)
        );

        // Tell the console we're not executing anymore, and that it can stop
        // showing a spinner.
        this.setState({ executing: false, executedFirstQuery: true });
      });
    });
  }

  render() {
    return (
      <div>
        <div className="mb3 flex items-center">
          <Button onClick={this.handleExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
          {this.renderOperationsDropdown()}
        </div>

        <div className="flex flex-fit border border-gray rounded" style={{ width: "100%" }}>
          <div className="col-6" style={{ minHeight: 500 }}>
            <GraphQLExplorerConsoleEditor
              value={this.state.query}
              onChange={this.handleEditorChange}
              onExecuteQueryPress={this.handleExecutePress}
            />
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

  renderOperationsDropdown() {
    if (!this.state.allOperationNames || (this.state.allOperationNames && !this.state.allOperationNames.length)) {
      return
    }

    return (
      <div className="ml2">
        <Dropdown width={250} ref={(c) => this.operationsDropdownComponent = c}>
          <div className="underline-dotted cursor-pointer inline-block">
            {this.state.currentOperationName}
          </div>
          {this.state.allOperationNames.map((operation) => {
            return (
              <div key={operation} className="btn block hover-bg-silver" onClick={(event) => this.handleOperationSelect(event, operation)}>
                <span className="block monospace truncate" style={{fontSize: 12}}>{operation}</span>
              </div>
            );
          })}
        </Dropdown>
      </div>
    )
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
        <GraphQLExplorerConsoleResultsViewer results={this.state.results.output} className="p1 flex-auto" style={{ width: "100%" }} />
        {this.renderDebuggingInformation()}
      </React.Fragment>
    );
  }

  renderDebuggingInformation() {
    // Only render debugging information if we've got some to show, and we're
    // in "debug" mode.
    if (this.state.results && this.state.results.performance && this.context.router.location.query["debug"] === "true") {
      return (
        <div className="px3 py2 border-top border-gray bg-silver col-12 flex-none">
          <div className="bold black mb1">Performance 🚀</div>
          <pre className="monospace" style={{ fontSize: 12 }}>{this.state.results.performance.split("; ").join("\n")}</pre>
        </div>
      );
    }
  }

  handleOperationSelect = (event, operationName) => {
    event.preventDefault();

    this.operationsDropdownComponent.setShowing(false);
    this.setState(consoleState.setCurrentOperationName(operationName));
  };

  handleEditorChange = (query) => {
    this.setState(consoleState.setQuery(query));
  };

  handleExecuteClick = (event) => {
    event.preventDefault();

    this.executeCurrentQuery();
  };

  handleExecutePress = () => {
    this.executeCurrentQuery();
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
