import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import classNames from 'classnames';

import Panel from '../../shared/Panel';
import JobLink from '../../shared/JobLink';
import { getColourForConnectionState, getLabelForConnectionState } from '../shared';

class AgentRow extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      connectionState: React.PropTypes.string.isRequired,
      hostname: React.PropTypes.string.isRequired,
      job: React.PropTypes.object,
      metaData: React.PropTypes.array.isRequired,
      name: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      uuid: React.PropTypes.string.isRequired,
      version: React.PropTypes.string.isRequired
    })
  };

  render() {
    const { agent } = this.props;

    const iconClassName = classNames(
      'circle',
      getColourForConnectionState(agent.connectionState, 'bg-')
    );

    let metaDataContent = 'No metadata';
    if (agent.metaData.length > 0) {
      metaDataContent = agent.metaData.sort().join(' ');
    }

    return (
      <Panel.Row>
        <div className="flex">
          <div className="pr3 pt1">
            <div
              className={iconClassName}
              title={getLabelForConnectionState(agent.connectionState)}
              style={{ width: 12, height: 12 }}
            />
          </div>
          <div className="flex flex-auto flex-column">
            <div className="flex flex-auto">
              <div className="flex-auto">
                <div>
                  <Link
                    className="blue hover-navy text-decoration-none hover-underline"
                    to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}`}
                  >
                    {this.props.agent.name}
                  </Link>
                </div>
                <small className="dark-gray">{metaDataContent}</small>
              </div>
              <div className="right-align">
                <div className="black">v{this.props.agent.version}</div>
                <small className="dark-gray">{this.props.agent.hostname}</small>
              </div>
            </div>
            {
              agent.job
                && (
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
                )
            }
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
          ${JobLink.getFragment('job')}
        }
        uuid
        version
      }
    `
  }
});
