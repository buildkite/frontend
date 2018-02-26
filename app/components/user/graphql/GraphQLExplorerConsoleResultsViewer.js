// @flow

import React from "react";
import Loadable from "react-loadable";

class GraphQLExplorerConsoleResultsViewer extends React.PureComponent {
  componentDidMount() {
    const { CodeMirror } = this.props;

    this.resultsCodeMirror = CodeMirror(this.resultsElement, {
      value: "",
      theme: "graphql",
      mode: "graphql-results",
      readOnly: true
    });
  }

  componentWillUnmount() {
    if (this.resultsCodeMirror) {
      this.resultsCodeMirror = null;
    }
  }

  render() {
    return (
      <div ref={(el) => this.resultsElement = el} />
    );
  }
}

// Instead of exporting the viewer directly, we'll export a `Loadable`
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
    )
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
      <GraphQLExplorerConsoleResultsViewer CodeMirror={loaded.CodeMirror} />
    );
  }
});
