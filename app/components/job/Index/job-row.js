import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Emojify from '../../shared/Emojify';
import JobLink from '../../shared/JobLink';
import FriendlyTime from '../../shared/FriendlyTime';

class JobRow extends React.Component {
  render() {
    return (
      <Panel.Row>
        <div className="flex items-center">
          <div className="flex-none" style={{ width: 120 }}>
            {this.props.job.state}
          </div>
          <div className="flex-auto">
            <JobLink job={this.props.job} />
            <div className="dark-gray mt1">{this.renderQueryRules()}</div>
          </div>
          <div className="flex-none dark-gray">
            Created <FriendlyTime value={this.props.job.createdAt} />
          </div>
        </div>
      </Panel.Row>
    );
  }

  renderQueryRules() {
    if(!this.props.job.agentQueryRules.length) {
      return (
        <code>queue=default</code>
      )
    } else {
      return (
        <code>{this.props.job.agentQueryRules.join(", ")}</code>
      )
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
          createdAt
        }
        ${JobLink.getFragment('job')}
      }
    `
  }
});
