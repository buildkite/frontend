// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';

import AgentStateIcon from '../state-icon';

import Badge from '../../shared/Badge';
import Panel from '../../shared/Panel';
import JobLink from '../../shared/JobLink';

type Props = {
  agent: {
    id: string,
    hostname: string,
    job?: {
      state: string
    },
    isRunningJob: boolean,
    metaData: Array<Object>,
    name: string,
    organization: {
      slug: string
    },
    public: boolean,
    uuid: string,
    version: string
  }
};

class AgentRow extends React.PureComponent<Props> {
  static propTypes = {
    agent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      hostname: PropTypes.string.isRequired,
      job: PropTypes.shape({
        state: PropTypes.string
      }),
      metaData: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired,
      public: PropTypes.bool.isRequired,
      uuid: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired
    }).isRequired
  };

  renderJob() {
    const { agent } = this.props;

    if (agent.isRunningJob) {
      const job = agent.job
        ? <JobLink job={agent.job} />
        : 'a job owned by another team';

      return (
        <small
          className="block mt1 pt1 border border-gray"
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none'
          }}
        >
          Running {job}
        </small>
      );
    }
  }

  render() {
    const { agent } = this.props;

    let metaDataContent = 'No metadata';
    if (agent.metaData.length > 0) {
      metaDataContent = agent.metaData.sort().join(' ');
    }

    return (
      <Panel.Row>
        <div className="flex">
          <AgentStateIcon agent={agent} className="pr3 pt1" />
          <div className="flex flex-auto flex-column">
            <div className="flex flex-auto">
              <div className="flex-auto">
                <div>
                  <Link
                    className="blue hover-navy text-decoration-none hover-underline"
                    to={`/organizations/${agent.organization.slug}/agents/${agent.uuid}`}
                  >
                    {agent.name}
                  </Link>
                  {this.renderPublicBadge()}
                </div>
                <small className="dark-gray">{metaDataContent}</small>
              </div>
              <div className="flex-none right-align">
                <div className="black">v{agent.version}</div>
                <small className="dark-gray">{agent.hostname}</small>
              </div>
            </div>
            {this.renderJob()}
          </div>
        </div>
      </Panel.Row>
    );
  }

  renderPublicBadge() {
    if (this.props.agent.public) {
      return (
        <Badge outline={true} className="regular" title="Visible to everyone, including people outside this organization">Public</Badge>
      );
    }
  }
}

export default Relay.createContainer(AgentRow, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        ${AgentStateIcon.getFragment('agent')}
        id
        hostname
        metaData
        name
        organization {
          slug
        }
        public
        isRunningJob
        job {
          ...on JobTypeCommand {
            state
          }
          ${JobLink.getFragment('job')}
        }
        uuid
        version
      }
    `
  }
});
