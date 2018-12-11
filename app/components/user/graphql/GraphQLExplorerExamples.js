// @flow

import React from "react";
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay/compat";
import Environment from 'app/lib/relay/environment';
import Panel from 'app/components/shared/Panel';
import Dropdown from 'app/components/shared/Dropdown';
import SectionLoader from 'app/components/shared/SectionLoader';
import GraphQLExplorerExampleSection from "./GraphQLExplorerExampleSection";
import EXAMPLES from "./examples";
import type { GraphQLExplorerExamplesQueryResponse } from './__generated__/GraphQLExplorerExamplesQuery.graphql';

type Organization = {
  id: string,
  name: string
};

type Props = {
  viewer: {
    organizations: {
      edges: Array<{
        node: Organization
      }>
    }
  }
};

type State = {
  currentOrganization: ?Organization
};

class GraphQLExplorerExamples extends React.PureComponent<Props, State> {
  state = {
    currentOrganization: null
  }

  organizationDropdownComponent: ?Dropdown;

  getCurrentOrganization() {
    if (this.state.currentOrganization) {
      return this.state.currentOrganization;
    } else if (this.props.viewer.organizations.edges.length) {
      return this.props.viewer.organizations.edges[0].node;
    }

    return null;
  }

  renderOrganizationSwitcher(organization) {
    if (organization === null) {
      return null;
    }

    return (
      <div className="mb3 flex">
        <span className="semi-bold mr1">Change Organization:</span>

        <Dropdown
          width={150}
          ref={(organizationDropdownComponent) => this.organizationDropdownComponent = organizationDropdownComponent}
        >
          <div className="underline-dotted cursor-pointer inline-block">
            {organization.name}
          </div>
          {this.props.viewer.organizations.edges.map((edge) => {
            return (
              <div
                key={edge.node.id}
                className="btn block hover-bg-silver"
                onClick={(event) => this.onOrganizationClick(event, edge.node)}
              >
                <span className="block">
                  {edge.node.name}
                </span>
              </div>
            );
          })}
        </Dropdown>
      </div>
    );
  }

  render() {
    const currentOrganization = this.getCurrentOrganization();

    return (
      <div>
        <p>Here are some example GraphQL Query and Mutations to get you started.</p>

        {this.renderOrganizationSwitcher(currentOrganization)}

        {EXAMPLES.map((example) => {
          return (
            <Panel key={example} style={{ borderLeftWidth: 4 }} className="mb4">
              <Panel.Section>
                <GraphQLExplorerExampleSection
                  query={example}
                  organization={currentOrganization}
                />
              </Panel.Section>
            </Panel>
          );
        })}
      </div>
    );
  }

  onOrganizationClick = (event, organization) => {
    event.preventDefault();

    this.setState({ currentOrganization: organization });

    if (this.organizationDropdownComponent) {
      this.organizationDropdownComponent.setShowing(false);
    }
  };
}

const GraphQLExplorerExamplesContainer = createFragmentContainer(GraphQLExplorerExamples, {
  viewer: graphql`
    fragment GraphQLExplorerExamples_viewer on Viewer {
      organizations(first: 100) {
        edges {
          node {
            id
            name
            slug
            permissions {
              pipelineView {
                allowed
                code
              }
            }
          }
        }
      }
    }
  `
});

const GraphQLExplorerExamplesQuery = graphql`
  query GraphQLExplorerExamplesQuery {
    viewer {
      ...GraphQLExplorerExamples_viewer
    }
  }
`;


/* eslint-disable react/no-multi-comp */
export default class GraphQLExplorerExamplesQueryContainer extends React.PureComponent<{}> {
  environment = Environment.get();

  render() {
    return (
      <QueryRenderer
        environment={this.environment}
        query={GraphQLExplorerExamplesQuery}
        render={this.renderQuery}
      />
    );
  }

  renderQuery({ props }: { props: GraphQLExplorerExamplesQueryResponse }) {
    if (props) {
      return <GraphQLExplorerExamplesContainer {...props} />;
    }
    return <SectionLoader />;
  }
}
