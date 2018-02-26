// @flow

import React from "react";

import Button from "../../shared/Button";

import GraphQLExplorerConsoleEditor from "./GraphQLExplorerConsoleEditor"
import GraphQLExplorerConsoleResultsViewer from "./GraphQLExplorerConsoleResultsViewer"

class GraphQLExplorerConsole extends React.PureComponent {
  state = {
    performance: null,
    executing: false,
    executedFirstQuery: false
  };

  render() {
    return (
      <div>
        <div className="mb3">
          <Button onClick={this.onExecuteClick} loading={this.state.executing && "Executing…"}>Execute</Button>
        </div>

        <div className="flex flex-fit border border-gray rounded" style={{ width: "100%" }}>
          <div className="col-6" style={{ minHeight: 500 }}>
	    <GraphQLExplorerConsoleEditor />
          </div>

          <div className="col-6 border-left border-gray">
	    {this.renderOutputPanel()}
          </div>
        </div>
      </div>
    );
  }

  renderOutputPanel() {
    // If we've gotten this far, then we're not executing, and we've got output :)
    let performanceInformationNode;
    if (this.state.performance) {
      performanceInformationNode = (
	<div className="px3 py2 border-top border-gray bg-silver col-12">
	  <div className="bold black mb1">Performance 🚀</div>
	  <pre className="monospace" style={{ fontSize: 12 }}>{this.state.performance.split("; ").join("\n")}</pre>
	</div>
      );
    }

    let helpfullMessageNode;
    if (!this.state.executedFirstQuery) {
      helpfullMessageNode = (
	<div className="flex items-center justify-center absolute" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
	  <span>Hit the <span className="semi-bold">Execute</span> above button to run this query! ☝️ </span>
	</div>
      );
    }

    return (
      <div className="relative flex flex-wrap content-between" style={{ height: "100%", width: "100%" }}>
	{helpfullMessageNode}
	<div className="p1">
          <GraphQLExplorerConsoleResultsViewer />
        </div>
	{performanceInformationNode}
      </div>
    );
  }
}

export default GraphQLExplorerConsole;
