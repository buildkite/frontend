// @flow

import * as React from "react";
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql, commitMutation } from "react-relay/compat";
import type { RelayProp } from 'react-relay';

import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";

import FlashesStore from '../../../stores/FlashesStore';

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
  },
  relay: RelayProp,
  graphQLSnippet?: {
    query: string,
    url: string,
    operationName: ?string
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
  shareLinkTextInput: ?HTMLInputElement
  focusOnSelectShareLinkOnNextUpdate: ?boolean

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

    if (this.props.graphQLSnippet) {
      consoleState.setGraphQLSnippet(this.props.graphQLSnippet);
    }

    const defaultState = consoleState.toStateObject();
    this.state = {
      results: null,
      query: defaultState.query,
      currentOperationName: defaultState.currentOperationName,
      allOperationNames: defaultState.allOperationNames,
      executing: false,
      sharing: false,
      shareLink: this.props.graphQLSnippet ? this.props.graphQLSnippet.url : null
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
    if (this.state.shareLink) {
      this.setState({ shareLink: null });
      this.context.router.replace("/user/graphql/console");
    }
  }

  componentDidUpdate() {
    if (this.shareLinkTextInput && this.focusOnSelectShareLinkOnNextUpdate) {
      this.shareLinkTextInput.select();
      this.focusOnSelectShareLinkOnNextUpdate = null;
    }
  }

  render() {
    return (
      <div>
        <div className="mb3 flex justify-start">
          <div className="flex items-center">
            <Button onClick={this.handleExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
            {this.renderOperationsDropdown()}
          </div>

          <div className="flex flex-auto justify-end items-center pl2">
            {this.renderShareLink()}
            <Button onClick={this.handleShareClick} theme={"default"} outline={true} loading={this.state.sharing && "Creating share link…"}>Share</Button>
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
      const estimatedWidth = this.state.shareLink.length * 7.3;

      return (
        <div className="flex-auto mr2" style={{ maxWidth: 450 }}>
          <input
            ref={(textInput) => this.shareLinkTextInput = textInput}
            type="text"
            readOnly={true}
            value={this.state.shareLink}
            style={{ width: "100%", fontSize: "inherit" }}
            className="p2 rounded border border-gray bg-silver"
            onClick={this.handleShareLinkClick}
          />
        </div>
      );
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

  handleShareLinkClick = () => {
    if (this.shareLinkTextInput) {
      this.shareLinkTextInput.select();
    }
  }

  handleShareClick = () => {
    this.invalidateShareLink();
    this.setState({ sharing: true });

    const mutation = graphql`
      mutation GraphQLExplorerConsole_graphQLSnippetCreateMutation(
        $input: GraphQLSnippetCreateInput!
      ) {
        graphQLSnippetCreate(input: $input) {
          graphQLSnippet {
            url
          }
        }
      }
    `;

    const variables = {
      input: {
        query: this.state.query,
        operationName: this.state.currentOperationName
      }
    };

    commitMutation(
      this.props.relay.environment,
      {
        mutation: mutation,
        variables: variables,
        onCompleted: this.handleMutationComplete,
        onError: this.handleMutationError
      }
    );
  };

  handleMutationError = (error) => {
    if (error) {
      FlashesStore.flash(FlashesStore.ERROR, error);
    }

    this.setState({ sharing: false });
  };

  handleMutationComplete = (response) => {
    const shareLinkURL = new URL(response.graphQLSnippetCreate.graphQLSnippet.url);

    this.focusOnSelectShareLinkOnNextUpdate = true;
    this.setState({ sharing: false, shareLink: shareLinkURL.href });
  };
}

export default createFragmentContainer(GraphQLExplorerConsole, {
  graphQLSnippet: graphql`
    fragment GraphQLExplorerConsole_graphQLSnippet on GraphQLSnippet {
      query
      operationName
      url
    }
  `,
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
