import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import PipelineIcon from '../icons/Pipeline';

class Welcome extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    })
  };

  render() {
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
          Need inspiration? See the <a className="blue hover-navy text-decoration-none hover-underline" target="_blank" rel="noopener noreferrer" href="https://github.com/buildkite/example-pipelines">example pipelines</a> GitHub repo.
        </p>
        <p>
          <a
            className="mt4 btn btn-primary bg-lime hover-white white rounded"
            href={`/organizations/${this.props.organization.slug}/pipelines/new`}
          >
            New Pipeline
          </a>
        </p>
      </div>
    );
  }
}

export default Relay.createContainer(Welcome, {
  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        slug
        permissions {
          pipelineCreate {
            code
            allowed
            message
          }
        }
      }
    `
  }
});
