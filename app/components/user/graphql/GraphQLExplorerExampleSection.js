import React from "react";
import PropTypes from 'prop-types';

import Button from "../../shared/Button";
import { interpolateQuery, setCurrentQuery } from "./query";

import CodeMirror from './codemirror';

class GraphQLExplorerExampleSection extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    hovering: null
  }

  getInterpolatedQuery() {
    return interpolateQuery(this.props.query, {
      organization: this.props.organization
    });
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
    if (this.props.organization != prevProps.organization) {
      this.editor.setValue(this.getInterpolatedQuery());
    }
  }

  render() {
    return (
      <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} className="relative">
        <Button
          style={{visibility: this.state.hovering ? 'visible' : 'hidden', right: 0, top: 0, zIndex: 10}}
          theme="default"
          className="absolute bg-white"
          outline={true}
          onClick={this.onCopyToConsoleClick}
        >
          Copy to Console
        </Button>

        <div ref={(el) => this.exampleQueryContainerElement = el}></div>
      </div>
    );
  }

  onCopyToConsoleClick = (event) => {
    event.preventDefault();

    setCurrentQuery(this.getInterpolatedQuery());

    this.context.router.push("/user/graphql/console");
  };

  onMouseOver = () => {
    this.setState({ hovering: true });
  };

  onMouseOut = () => {
    this.setState({ hovering: false });
  };
}

export default GraphQLExplorerExampleSection;
