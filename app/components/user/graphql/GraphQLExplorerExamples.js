import React from "react";
import {createFragmentContainer, graphql} from "react-relay/compat";

import Panel from "../../shared/Panel";
import Dropdown from "../../shared/Dropdown";

import GraphQLExplorerExampleSection from "./GraphQLExplorerExampleSection";
import EXAMPLES from "./examples"

class GraphQLExplorerExamples extends React.Component {
  state = {
    currentOrganization: null
  }

  getCurrentOrganization() {
    if (this.state.currentOrganization) {
      return this.state.currentOrganization;
    } else if (this.props.viewer.organizations.edges.length) {
      return this.props.viewer.organizations.edges[0].node;
    } else {
      return null;
    }
  }

  renderOrganizationSwitcher() {
    if (this.props.viewer.organizations.edges.length <= 1) {
      return null;
    }

    return (
      <div className="mb3 flex">
        <span className="semi-bold mr1">Switch Organization:</span>

        <Dropdown width={150} ref={(c) => this.organizationDropdownComponent = c}>
          <div className="underline-dotted cursor-pointer inline-block">
            {this.getCurrentOrganization().name}
          </div>
          {this.props.viewer.organizations.edges.map((edge) => {
            return (
              <div key={edge.node.id} className="btn block hover-bg-silver" onClick={(event) => this.onOrganizationClick(event, edge.node) }>
                <span className="block">{edge.node.name}</span>
              </div>
            )
          })}
        </Dropdown>
      </div>
    )
  }

  render() {
    let currentOrganization = this.getCurrentOrganization();

    return (
      <div>
        {this.renderOrganizationSwitcher()}

        <Panel>
          {Object.entries(EXAMPLES).map(([id, example]) => {
            return (
              <Panel.Section key={id}>
                <GraphQLExplorerExampleSection name={example.name} query={example.query} organization={currentOrganization} />
              </Panel.Section>
            )
          })}
        </Panel>
      </div>
    );
  }

  onOrganizationClick = (event, organization) => {
    event.preventDefault();

    this.setState({ currentOrganization: organization });
    this.organizationDropdownComponent.setShowing(false);
  };
}

export default createFragmentContainer(GraphQLExplorerExamples, {
  viewer: graphql`
    fragment GraphQLExplorerExamples_viewer on Viewer {
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
