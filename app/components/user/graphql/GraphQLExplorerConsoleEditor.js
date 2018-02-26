// @flow

import React from "react";
import Loadable from "react-loadable";

import { fetchAndBuildGraphQLSchema, getGraphQLSchema } from "./graphql";

class GraphQLExplorerConsoleEditor extends React.PureComponent {
  componentDidMount() {
    const { CodeMirror } = this.props;
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

  render() {
    return (
      <div>
        <textarea
          name={this.props.name}
          defaultValue={this.props.value}
          ref={(input) => this.input = input}
        />
      </div>
    );
  }
}

// Instead of exporting the editor directly, we'll export a `Loadable`
// Component that will allow us to load in dependencies and render the editor
// until then.
export default Loadable.Map({
  loader: {
    CodeMirror: () => (
      import('./codemirror').then((module) => (
        // Add a "zero" delay after the module has loaded, to allow their
        // styles to take effect.
        new Promise((resolve) => {
          setTimeout(() => resolve(module.default), 0);
        })
      ))
    ),
    // Load in the GraphQL schema at the same time
    graaphQLSchema: () => {
      return fetchAndBuildGraphQLSchema()
    }
  },

  loading(props) {
    if (props.error) {
      return (
        <div>{props.error}</div>
      );
    } else if (props.pastDelay) {
      return (
        <div>Loading...</div>
      );
    } else {
      return null;
    }
  },

  render(loaded, props) {
    return (
      <GraphQLExplorerConsoleEditor CodeMirror={loaded.CodeMirror} graaphQLSchema={loaded.graaphQLSchema} />
    );
  }
});
