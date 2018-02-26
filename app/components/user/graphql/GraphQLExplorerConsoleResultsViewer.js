// @flow

import React from "react";
import Loadable from "react-loadable";

class GraphQLExplorerConsoleResultsViewer extends React.PureComponent {
  componentDidMount() {
    this.resultsCodeMirror = this.props.CodeMirror(this.resultsElement, {
      value: this.props.results || "",
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

  componentDidUpdate(prevProps) {
    if (this.props.results != prevProps.results) {
      this.resultsCodeMirror.setValue(this.props.results);
    }
  }

  render() {
    return (
      <div ref={(el) => this.resultsElement = el} className={this.props.className} style={this.props.style} />
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
    } else {
      return null;
    }
  },

  render(loaded, props) {
    return (
      <GraphQLExplorerConsoleResultsViewer
        CodeMirror={loaded.CodeMirror}
        results={props.results}
        className={props.className}
        style={props.style}
      />
    );
  }
});
