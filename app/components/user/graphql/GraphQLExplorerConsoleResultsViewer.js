// @flow
/* eslint-disable react/prop-types */

import React from "react";
import Loadable from "react-loadable";

type CodeMirrorInstance = {
  showHint: ({}) => void,
  on: (string, (any) => void) => mixed,
  off: (string, (any) => void) => mixed,
  getValue: () => string,
  setValue: (?string) => void,
  execCommand: (string) => void
}

type Props = {
  results?: string,
  className?: string,
  style?: {}
};

type LoadedProps = {
  CodeMirror: (HTMLDivElement, {}) => CodeMirrorInstance
};

type ReactLoadableLoadingProps = {
  error?: string
};

class GraphQLExplorerConsoleResultsViewer extends React.PureComponent<Props & LoadedProps> {
  codeMirrorInstance: ?CodeMirrorInstance
  resultsElement: ?HTMLDivElement

  componentDidMount() {
    if (this.resultsElement) {
      this.codeMirrorInstance = this.props.CodeMirror(this.resultsElement, {
        value: this.props.results || "",
        theme: "graphql",
        mode: "graphql-results",
        readOnly: true
      });
    }
  }

  componentWillUnmount() {
    if (this.codeMirrorInstance) {
      this.codeMirrorInstance = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.results !== prevProps.results) {
      if (this.codeMirrorInstance) {
        this.codeMirrorInstance.setValue(this.props.results);
      }
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

  loading(props: ReactLoadableLoadingProps) {
    if (props.error) {
      return (
        <div>{props.error}</div>
      );
    }

    return null;
  },

  render(loaded: LoadedProps, props: Props) {
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
