// @flow

import * as React from "react";
import PropTypes from 'prop-types';
import { QueryRenderer, createFragmentContainer, graphql, commitMutation } from "react-relay/compat";
import Environment from 'app/lib/relay/environment';
import SectionLoader from 'app/components/shared/SectionLoader';
import Button from 'app/components/shared/Button';
import Dropdown from 'app/components/shared/Dropdown';
import FlashesStore from 'app/stores/FlashesStore';
import GraphQLExplorerConsoleEditor from "./GraphQLExplorerConsoleEditor";
import GraphQLExplorerConsoleResultsViewer from "./GraphQLExplorerConsoleResultsViewer";
import { executeQuery, prettifyQuery } from "./query";
import consoleState from "./consoleState";
import type { RelayProp } from 'react-relay';
import type { GraphQLExplorerConsoleSnippetQueryResponse } from './__generated__/GraphQLExplorerConsoleSnippetQuery.graphql';
import type { GraphQLExplorerConsole_graphQLSnippet } from './__generated__/GraphQLExplorerConsole_graphQLSnippet.graphql';
import type { GraphQLExplorerConsole_viewer } from './__generated__/GraphQLExplorerConsole_viewer.graphql';

type Props = {
  relay: RelayProp,
  viewer: GraphQLExplorerConsole_viewer,
  graphQLSnippet: null | GraphQLExplorerConsole_graphQLSnippet
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
  shareDropdownComponent: ?Dropdown
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

    if (this.props.viewer.organizations && this.props.viewer.organizations.edges) {
      consoleState.setOrganizationEdges(this.props.viewer.organizations.edges);
    }

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
      <div data-testid="GraphQLExplorerConsole">
        <div className="mb3 flex justify-start">
          <div className="flex items-center">
            <Button onClick={this.handleExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
            {this.renderOperationsDropdown()}
          </div>

          <div className="flex flex-auto justify-end items-center pl2">
            {this.renderShareLink()}

            <Dropdown width={320} ref={(component) => this.shareDropdownComponent = component}>
              <Button
                theme="default"
                outline={true}
                loading={this.state.sharing && "Generating share link…"}
              >
                Share Query
              </Button>

              <div className="mx3 my2">
                <p className="mt2">
                  When you share a GraphQL query, Buildkite generates a unique URL for it.
                  Anyone with that URL and a Buildkite account will be able to see your query and arguments.
                </p>
                <p>If they run your shared query, the result will only include items they already have access to, according to their Organization and Team memberships.</p>
                <Button
                  onClick={this.handleShareClick}
                  style={{ width: "100%" }}
                >
                  Ok, Share this Query
                </Button>
              </div>
            </Dropdown>

            <Button
              theme="default"
              outline={true}
              className="ml2"
              onClick={this.handlePrettifyClick}
            >
              Prettify
            </Button>
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
          <GraphQLExplorerConsoleResultsViewer
            results={this.state.results.output}
            className="p1 flex-auto bg-silver"
            style={{ width: "100%" }}
          />
          {this.renderDebuggingInformation()}
        </React.Fragment>
      );
    }

    return (
      <div className="flex items-center justify-center absolute bg-silver" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
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
        <div className="flex-auto mr2" style={{ maxWidth: 450 }}>
          <input
            ref={(textInput) => this.shareLinkTextInput = textInput}
            type="text"
            readOnly={true}
            value={this.state.shareLink}
            style={{ width: "100%", fontSize: "inherit" }}
            className="p2 m0 rounded border border-gray bg-silver"
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

  handlePrettifyClick = () => {
    prettifyQuery(this.state.query, (query) => {
      this.setState({ query: query });
    });
  }

  handleShareLinkClick = () => {
    if (this.shareLinkTextInput) {
      this.shareLinkTextInput.select();
    }
  }

  handleShareClick = () => {
    this.invalidateShareLink();
    this.setState({ sharing: true });

    if (this.shareDropdownComponent) {
      this.shareDropdownComponent.setShowing(false);
    }

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

const GraphQLExplorerConsoleContainer = createFragmentContainer(GraphQLExplorerConsole, {
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
            permissions {
              pipelineView {
                allowed
                code
              }
            }
          }
        }
      }
    }
  `
});

const GraphQLExplorerConsoleContainerQuery = graphql`
  query GraphQLExplorerConsoleSnippetQuery($hasSnippet: Boolean! $snippet: String!) {
    viewer {
      ...GraphQLExplorerConsole_viewer
    }
    graphQLSnippet(uuid: $snippet) @include (if: $hasSnippet) {
      query
      operationName
      url
      ...GraphQLExplorerConsole_graphQLSnippet
    }
  }
`;

type ContainerProps = {
  params: {
    snippet?: string
  }
};

/* eslint-disable react/no-multi-comp */
export default class GraphQLExplorerConsoleQueryContainer extends React.PureComponent<ContainerProps> {
  environment = Environment.get();

  get snippet(): string {
    return this.props.params.snippet || "";
  }

  get hasSnippet(): boolean {
    return this.snippet !== "";
  }

  render() {
    return (
      <QueryRenderer
        environment={this.environment}
        query={GraphQLExplorerConsoleContainerQuery}
        variables={{ snippet: this.snippet, hasSnippet: this.hasSnippet }}
        render={this.renderQuery}
      />
    );
  }

  renderQuery({ props }: { props: GraphQLExplorerConsoleSnippetQueryResponse }) {
    if (props) {
      return (
        // $FlowExpectError `graphQLSnippet` here needs to be null to avoid a warning because of the weird `@include` stuff we’re doing.
        <GraphQLExplorerConsoleContainer graphQLSnippet={null} {...props} {...this.props} />
      );
    }
    return <SectionLoader />;
  }
}
