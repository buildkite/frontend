import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import JobLink from '../../shared/JobLink';
import FriendlyTime from '../../shared/FriendlyTime';

class JobRow extends React.Component {
  static propTypes = {
    job: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <Panel.Row>
        <div className="flex items-center">
          <div className="flex-none" style={{ width: 120 }}>
            {this.props.job.state.toLowerCase()}
          </div>
          <div className="flex-auto">
            <JobLink job={this.props.job} />
            <div className="dark-gray mt1">{this.renderQueryRules()}</div>
          </div>
          {this.renderConcurrency()}
          <div className="flex-none dark-gray">
            Created <FriendlyTime value={this.props.job.createdAt} />
          </div>
        </div>
      </Panel.Row>
    );
  }

  renderConcurrency() {
    if (this.props.job.concurrency) {
      return (
        <div className="flex-none pr4">
          <code className="dark-gray">{this.props.job.concurrency.group} [{this.props.job.concurrency.limit}]</code>
        </div>
      );
    }
  }

  renderQueryRules() {
    if (!this.props.job.agentQueryRules.length) {
      return (
        <code>queue=default</code>
      );
    } else {
      return (
        <code>{this.props.job.agentQueryRules.join(", ")}</code>
      );
    }
  }
}

export default Relay.createContainer(JobRow, {
  fragments: {
    job: () => Relay.QL`
      fragment on Job {
        ...on JobTypeCommand {
          id
          state
          agentQueryRules
          concurrency {
            group
            limit
          }
          createdAt
        }
        ${JobLink.getFragment('job')}
      }
    `
  }
});
