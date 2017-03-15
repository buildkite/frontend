import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';

class JobRow extends React.Component {
  render() {
    return (
      <Panel.Row>
        <div>{this.props.job.label}</div>
      </Panel.Row>
    );
  }
}

export default Relay.createContainer(JobRow, {
  fragments: {
    job: () => Relay.QL`
      fragment on Job {
        ...on JobTypeCommand {
          pipeline {
            name
            slug
          }
          state
          label
          agentQueryRules
        }
      }
    `
  }
});
