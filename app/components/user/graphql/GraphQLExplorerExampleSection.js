// @flow

import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';

import Button from 'app/components/shared/Button';
import { interpolateQuery } from "./query";
import consoleState from "./consoleState";

type CodeMirrorInstance = {
  showHint: ({}) => void,
  on: (string, (any) => void) => mixed,
  off: (string, (any) => void) => mixed,
  getValue: () => string,
  setValue: (?string) => void,
  execCommand: (string) => void
};

type Props = {
  query: string,
  organization: ?Object
};

type LoadedProps = {
  CodeMirror: (HTMLDivElement, {}) => CodeMirrorInstance
};

type ReactLoadableLoadingProps = {
  error?: string
};

class GraphQLExplorerExampleSection extends React.PureComponent<Props & LoadedProps> {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  codeMirrorInstance: ?CodeMirrorInstance;
  exampleQueryContainerElement: ?HTMLDivElement;

  getInterpolatedQuery() {
    return interpolateQuery(
      this.props.query,
      {
        organization: this.props.organization
      }
    );
  }

  componentDidMount() {
    if (this.exampleQueryContainerElement) {
      this.codeMirrorInstance = this.props.CodeMirror(this.exampleQueryContainerElement, {
        value: this.getInterpolatedQuery(),
        mode: "graphql",
        theme: "graphql",
        readOnly: true
      });
    }
  }

  componentWillUnmount() {
    if (this.codeMirrorInstance) {
      this.codeMirrorInstance = null;
    }
  }

  componentDidUpdate(prevProps: { organization: ?Object }) {
    // If the organization changes, we'll need to re-interpolate the query as
    // the variables inside it will probably have changed.
    if (this.codeMirrorInstance && this.props.organization !== prevProps.organization) {
      this.codeMirrorInstance.setValue(this.getInterpolatedQuery());
    }
  }

  render() {
    return (
      <div className="relative">
        <Button
          style={{ right: 0, top: 0, zIndex: 10 }}
          theme="default"
          className="absolute bg-white"
          outline={true}
          /* $FlowExpectError */
          onClick={this.handleCopyToConsoleClick}
        >
          Copy to Console
        </Button>

        <div ref={(el) => this.exampleQueryContainerElement = el} />
      </div>
    );
  }

  handleCopyToConsoleClick = (event: MouseEvent) => {
    event.preventDefault();

    consoleState.setQuery(this.getInterpolatedQuery());

    this.context.router.push("/user/graphql/console");
  };
}

// Instead of exporting the viewer directly, we'll export a `Loadable`
// Component that will allow us to load in dependencies and render the editor
// until then.
/* eslint-disable react/prop-types */
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
      <GraphQLExplorerExampleSection
        CodeMirror={loaded.CodeMirror}
        query={props.query}
        organization={props.organization}
      />
    );
  }
});