// @flow

import * as React from "react";
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from "react-relay/compat";

import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";

import GraphQLExplorerConsoleEditor from "./GraphQLExplorerConsoleEditor";
import GraphQLExplorerConsoleResultsViewer from "./GraphQLExplorerConsoleResultsViewer";

import { executeQuery } from "./query";
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
  results?: ?{ output: string, performance: string },
  query?: string,
  currentOperationName?: ?string,
  allOperationNames?: ?Array<string>,
  executing: boolean,
  sharing: boolean,
  shareLink: ?string
};

class GraphQLExplorerConsole extends React.PureComponent<Props, State> {
  operationsDropdownComponent: ?Dropdown

  state = {
    results: null,
    query: "",
    currentOperationName: "",
    allOperationNames: null,
    executing: false,
    sharing: false,
    shareLink: null
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    consoleState.setOrganizationEdges(this.props.viewer.organizations.edges);

    const defaultState = consoleState.toStateObject();
    this.state = {
      results: null,
      query: defaultState.query,
      currentOperationName: defaultState.currentOperationName,
      allOperationNames: defaultState.allOperationNames,
      executing: false,
      sharing: false
    };
  }

  executeCurrentQuery() {
    this.setState({ executing: true });

    const payload = {
      query: this.state.query,
      operationName: this.state.currentOperationName
    };

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
        this.setState({ executing: false });
      });
    });
  }

  invalidateShareLink() {
    this.shareLinkSelected = false;
    this.setState({ shareLink: null });
  }

  componentDidUpdate() {
    if (this.shareLinkTextInput && !this.shareLinkSelected) {
      this.shareLinkTextInput.select();
      this.shareLinkSelected = true;
    }
  }

  render() {
    return (
      <div>
        <div className="mb3 flex">
          <div className="flex flex-auto items-center">
            <Button onClick={this.handleExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
            {this.renderOperationsDropdown()}
          </div>

          <div className="flex items-center">
            {this.renderShareLink()}
            <Button onClick={this.handleShareClick} theme={"default"} outline={true} loading={this.state.sharing && "Creating share link..."}>Share</Button>
          </div>
        </div>

        <div className="flex flex-fit border border-gray rounded" style={{ width: "100%" }}>
          <div className="col-6" style={{ minHeight: 500 }}>
            <GraphQLExplorerConsoleEditor
              value={this.state.query}
              onChange={this.handleEditorChange}
              onExecuteQueryPress={this.handleEditorExecutePress}
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
      return;
    }

    return (
      <div className="ml2">
        <Dropdown width={250} ref={(component) => this.operationsDropdownComponent = component}>
          <div className="underline-dotted cursor-pointer inline-block">
            {this.state.currentOperationName}
          </div>
          {this.state.allOperationNames.map((operation) => {
            return (
              <div key={operation} className="btn block hover-bg-silver" onClick={(event) => this.handleOperationSelect(event, operation)}>
                <span className="block monospace truncate" style={{ fontSize: 12 }}>{operation}</span>
              </div>
            );
          })}
        </Dropdown>
      </div>
    );
  }

  renderOutputPanel() {
    if (this.state.results) {
      return (
        <React.Fragment>
          <GraphQLExplorerConsoleResultsViewer results={this.state.results.output} className="p1 flex-auto bg-silver" style={{ width: "100%" }} />
          {this.renderDebuggingInformation()}
        </React.Fragment>
      );
    }

    return (
      <div className="flex items-center justify-center absolute bg-silver" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
        <span>Hit the <span className="semi-bold">Execute</span> above button to run this query! ☝️ </span>
      </div>
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

  renderShareLink() {
    if (this.state.shareLink) {
      return (
        <div className="mr2">
          <input
            ref={(textInput) => this.shareLinkTextInput = textInput}
            type="text"
            readOnly={true}
            value={this.state.shareLink}
            style={{width: 370, fontSize: "inherit"}}
            className="p2 rounded border border-gray bg-silver"
            onClick={this.handleShareLinkClick}
          />
        </div>
      )
    }
  }

  handleOperationSelect = (event, operationName) => {
    event.preventDefault();

    if (this.operationsDropdownComponent) {
      this.operationsDropdownComponent.setShowing(false);
    }

    this.setState(consoleState.setCurrentOperationName(operationName));
  };

  handleEditorChange = (query) => {
    this.setState(consoleState.setQuery(query));

    this.invalidateShareLink();
  };

  handleExecuteClick = (event) => {
    event.preventDefault();

    this.executeCurrentQuery();
  };

  handleEditorExecutePress = () => {
    this.executeCurrentQuery();
  };

  handleShareClick = () => {
    this.invalidateShareLink();
    this.setState({ sharing: true });

    setTimeout(() => {
      this.setState({ sharing: false, shareLink: "https://buildkite.com/user/graphql/console/e92428e1-506d-4fdb-b258-d77a1e79d6de" });
    }, 2000);
  };

  handleShareLinkClick = () => {
    if (this.shareLinkTextInput) {
      this.shareLinkTextInput.select();
    }
  }
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
