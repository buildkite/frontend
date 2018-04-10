import React from "react";
import PropTypes from 'prop-types';

import Button from "../../shared/Button";
import { interpolateQuery } from "./query";
import consoleState from "./consoleState";

import CodeMirror from './codemirror';

class GraphQLExplorerExampleSection extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  getInterpolatedQuery() {
    return interpolateQuery(
      this.props.query,
      {
        organization: this.props.organization
      }
    );
  }

  componentDidMount() {
    this.editor = CodeMirror(this.exampleQueryContainerElement, {
      value: this.getInterpolatedQuery(),
      mode: "graphql",
      theme: "graphql",
      readOnly: true
    });
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor = null;
    }
  }

  componentDidUpdate(prevProps) {
    // If the organization changes, we'll need to re-interpolate the query as
    // the variables inside it will probably have changed.
    if (this.props.organization !== prevProps.organization) {
      this.editor.setValue(this.getInterpolatedQuery());
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
          onClick={this.handleCopyToConsoleClick}
        >
          Copy to Console
        </Button>

        <div ref={(el) => this.exampleQueryContainerElement = el} />
      </div>
    );
  }

  handleCopyToConsoleClick = (event) => {
    event.preventDefault();

    consoleState.setQuery(this.getInterpolatedQuery());

    this.context.router.push("/user/graphql/console");
  };
}

export default GraphQLExplorerExampleSection;
