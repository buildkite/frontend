import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { Link } from 'react-router';

import StateIcon from '../state-icon';
import Panel from '../../shared/Panel';
import JobLink from '../../shared/JobLink';

class AgentRow extends React.Component {
  static propTypes = {
    agent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      connectionState: PropTypes.string.isRequired,
      hostname: PropTypes.string.isRequired,
      job: PropTypes.shape({
        state: PropTypes.string
      }),
      metaData: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired,
      uuid: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired
    })
  };

  renderJob() {
    const { agent } = this.props;

    if (agent.job) {
      return (
        <small
          className="block mt1 pt1 border border-gray"
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none'
          }}
        >
          Running <JobLink job={agent.job} />
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
          <StateIcon agent={agent} className="pr3 pt1" />
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
}

export default Relay.createContainer(AgentRow, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        connectionState
        hostname
        metaData
        name
        organization {
          slug
        }
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
