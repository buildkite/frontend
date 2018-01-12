import React from "react";
import PropTypes from 'prop-types';
import {createFragmentContainer, graphql} from "react-relay/compat";

import Panel from "../../shared/Panel";
import Button from "../../shared/Button";
import Spinner from "../../shared/Spinner";

import { getCurrentQuery, setCurrentQuery, interpolateQuery } from "./query";
import { getGraphQLSchema } from "./graphql";
import { DEFAULT_QUERY_WITH_ORGANIZATION, DEFAULT_QUERY_NO_ORGANIZATION } from "./defaults";

import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/keymap/sublime';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

class GraphQLExplorerConsole extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    performance: null,
    output: null,
    executing: false
  };

  componentDidMount() {
    const schema = getGraphQLSchema();

    this.editor = CodeMirror.fromTextArea(
      this.input,
      {
        lineNumbers: true,
        tabSize: 2,
        mode: 'graphql',
        keyMap: 'sublime',
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        viewportMargin: Infinity,
        gutters: ['CodeMirror-linenumbers'],
        theme: "graphql",
        extraKeys: {
	  'Cmd-Space': () => this.editor.showHint({ completeSingle: true }),
	  'Ctrl-Space': () => this.editor.showHint({ completeSingle: true }),
	  'Alt-Space': () => this.editor.showHint({ completeSingle: true }),
	  'Shift-Space': () => this.editor.showHint({ completeSingle: true }),

	  'Cmd-Enter': () => {
	    this.executeCurrentQuery();
	  },
	  'Ctrl-Enter': () => {
	    this.executeCurrentQuery();
	  },

	  // Persistent search box in Query Editor
	  'Cmd-F': 'findPersistent',
	  'Ctrl-F': 'findPersistent',

	  // Editor improvements
          'Ctrl-Left': 'goSubwordLeft',
          'Ctrl-Right': 'goSubwordRight',
          'Alt-Left': 'goGroupLeft',
          'Alt-Right': 'goGroupRight'
        },
        lint: {
          schema: schema
        },
        hintOptions: {
	  schema: schema,
	  closeOnUnfocus: false,
	  completeSingle: false
        }
      }
    );

    this.editor.on("change", this.onEditorChange);
    this.editor.on("keyup", this.onEditorKeyUp);
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.off("change", this.onEditorChange);
      this.editor.off("keyup", this.onEditorKeyUp);

      this.editor = null;
    }
  }

  getDefaultQuery() {
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
          <Button onClick={this.onExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
        </div>

        <div className="flex flex-fit border border-gray rounded" style={{width: "100%"}}>
          <div className="col-6 mr4 buildkite-codemirror" style={{minHeight: 500}}>
            <textarea
              defaultValue={this.getDefaultQuery()}
              ref={(input) => this.input = input}
            />
          </div>

          <div className="bg-silver col-6 border-left border-gray">
            {this.renderOutputPanel()}
          </div>
        </div>
      </div>
    );
  }

  renderOutputPanel() {
    let previousPanelHeight = this.previousOutputElementHeight || "100%";

    // If we're currently executing a query, we should show a spinner
    if (this.state.executing) {
      return (
        <div className="flex items-center justify-center" style={{height: previousPanelHeight}}>
          <Spinner /> <span className="dark-gray">Executing GraphQL Query…</span>
        </div>
      )
    }

    // If no query has been executed, let's show a helpfull message
    if (!this.state.output) {
      return (
        <div className="flex items-center justify-center" style={{height: previousPanelHeight}}>
          <span className="dark-gray">Hit the <span className="semi-bold">Execute</span> above button to run this query! ☝️ </span>
        </div>
      )
    }

    // If we've gotten this far, then we're not executing, and we've got output :)
    let performanceInformationNode;
    if (this.state.performance) {
      performanceInformationNode = (
        <div className="px3 py2 border-top border-gray bg-white col-12">
          <div className="bold black mb1">Performance 🚀</div>
          <pre className="monospace bg-white" style={{fontSize: 12}}>{this.state.performance.split("; ").join("\n")}</pre>
        </div>
      )
    }

    return (
      <div className="flex flex-wrap content-between" ref={(outputElement) => this.outputElement = outputElement} style={{height: "100%"}}>
        <pre className="monospace px3 py2 col-12" style={{fontSize: 12, lineHeight: "17px"}}>{this.state.output}</pre>
        {performanceInformationNode}
      </div>
    )
  }

  executeCurrentQuery() {
    this.setState({ executing: true, output: null, performance: null });

    fetch(window._graphql['url'], {
      method: 'post',
      body: JSON.stringify({ query: this.editor.getValue() }),
      credentials: "same-origin",
      headers: window._graphql["headers"],
    }).then((response) => {
      setTimeout(() => {
        // Once we've got the resposne back, and converted it to JSON
        response.json().then((json) => {
          this.setState({
            performance: response.headers.get('x-buildkite-performance'),
            output: JSON.stringify(json, null, 2),
            executing: false
          }, () => {
            // Once we've rendered the output to the page, we grab the height
            // of the output panel so when they go to hit "Execute" again, we
            // can show the spinner in a panel of the same height (which avoids
            // a weird jump around in height).
            this.previousOutputElementHeight = this.outputElement.clientHeight;
          });
        });
      }, 1000);
    });
  }

  onExecuteClick = () => {
    event.preventDefault();

    this.executeCurrentQuery();
  };

  onEditorChange = () => {
    // TODO: debounce this...
    setCurrentQuery(this.editor.getValue())
  };

  onEditorKeyUp = () => {
    if (AUTO_COMPLETE_AFTER_KEY.test(event.key)) {
      this.editor.execCommand('autocomplete');
    }
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
