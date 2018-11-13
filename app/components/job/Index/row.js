import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from 'app/components/shared/Panel';
import JobLink from 'app/components/shared/JobLink';
import FriendlyTime from 'app/components/shared/FriendlyTime';

class Row extends React.PureComponent {
  static propTypes = {
    job: PropTypes.object.isRequired,
    onConcurrencyGroupClick: PropTypes.func,
    onAgentQueryRuleClick: PropTypes.func
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
          <code className="dark-gray">
            <span className="cursor-pointer hover-underline-dotted" onClick={this.handleConcurrencyGroupClick}>{this.props.job.concurrency.group}</span> [{this.props.job.concurrency.limit}]
          </code>
        </div>
      );
    }
  }

  renderQueryRules() {
    const agentQueryRules = !this.props.job.agentQueryRules.length ? ["queue=default"] : this.props.job.agentQueryRules;

    return agentQueryRules.map((agentQueryRule) => {
      return (
        <code
          key={agentQueryRule}
          onClick={(event) => this.handleAgentQueryRuleClick(event, agentQueryRule)}
          className="cursor-pointer hover-underline-dotted mr1"
        >
          {agentQueryRule}
        </code>
      );
    });
  }

  handleConcurrencyGroupClick = (event) => {
    event.preventDefault();

    this.props.onConcurrencyGroupClick(this.props.job.concurrency.group);
  }

  handleAgentQueryRuleClick = (event, agentQueryRule) => {
    event.preventDefault();

    this.props.onAgentQueryRuleClick(agentQueryRule);
  }
}

export default Relay.createContainer(Row, {
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
