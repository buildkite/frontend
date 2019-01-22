// @flow

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import PipelineIcon from 'app/components/icons/Pipeline';
import type { Welcome_organization } from './__generated__/Welcome_organization.graphql';

type Props = {
  organization: Welcome_organization,
  team: string
};

class Welcome extends React.PureComponent<Props> {
  get canCreatePipeline(): boolean {
    return (
      this.props.organization.permissions &&
      this.props.organization.permissions.pipelineCreate &&
      this.props.organization.permissions.pipelineCreate.code === "not_member_of_team"
        ? false : true);
  }


  render() {
    if (!this.canCreatePipeline) {
      return this.renderNoPipelineCreatePermission();
    }
    return this.renderWelcomeMessage();

  }

  renderNoPipelineCreatePermission() {
    return (
      <div className="center p4">
        <p>You don’t have permission to view or create any pipelines because you’ve not been assigned to a team.</p>
        <p>Please contact one of your team maintainers or organization administrators for help.</p>
      </div>
    );
  }

  renderWelcomeMessage() {
    // Attach the current team to the "New Pipeline" URL
    let newPipelineURL = `/organizations/${this.props.organization.slug}/pipelines/new`;
    if (this.props.team) {
      newPipelineURL += `?team=${this.props.team}`;
    }

    return (
      <div className="center p4">
        <PipelineIcon />
        <h1 className="h2 m0 mt2 mb4">
          Create your first pipeline
        </h1>
        <p className="mx-auto" style={{ maxWidth: "30em" }}>
          Pipelines define the tasks to be run on your agents. It’s best to keep each pipeline focussed on a single part of your delivery pipeline, such as testing, deployments or infrastructure. Once created, you can connect your pipeline with your source control or trigger it via the API.
        </p>
        <p className="dark-gray">
          Need inspiration? See the <a className="lime hover-lime text-decoration-none hover-underline" target="_blank" rel="noopener noreferrer" href="https://github.com/buildkite/example-pipelines">example pipelines</a> GitHub repo.
        </p>
        <p>
          <a
            className="mt4 btn btn-primary bg-lime hover-white white rounded"
            href={newPipelineURL}
          >
            New Pipeline
          </a>
        </p>
      </div>
    );
  }
}

export default createFragmentContainer(Welcome, graphql`
  fragment Welcome_organization on Organization {
    slug
    permissions {
      pipelineCreate {
        code
        allowed
        message
      }
    }
  }
`);
