import React from "react";
import PropTypes from 'prop-types';

import Button from "../../shared/Button";
import { interpolateQuery, setCurrentQuery } from "./query";

class GraphQLExplorerExampleSection extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    hovering: null
  }

  render() {
    this.cachedInterpolatedQuery = interpolateQuery(this.props.query, {
      organization: this.props.organization
    });

    return (
      <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <h4>{this.props.name}</h4>

        <div className="border rounded border-gray relative">
          <Button
            style={{visibility: this.state.hovering ? 'visible' : 'hidden', right: 10, top: 10}}
            theme="default"
            className="absolute bg-white"
            outline={true}
            onClick={this.onCopyToConsoleClick}
          >
            Copy to Console
          </Button>

          <pre className="monospace rounded bg-silver px3 py2" style={{fontSize: 13}}>
            {this.cachedInterpolatedQuery}
          </pre>
        </div>
      </div>
    );
  }

  onCopyToConsoleClick = (event) => {
    event.preventDefault();

    setCurrentQuery(this.cachedInterpolatedQuery);

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
