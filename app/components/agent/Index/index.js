import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../../shared/PageWithContainer';

import Agents from './agents';
import AgentTokens from './agentTokens';
import QuickStart from './quickStart';

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.shape({
        agentTokenView: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <PageWithContainer>
          {this.renderContent()}
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderContent() {
    const { organization, viewer } = this.props;

    // Switches between showing just the agents, or the agents along with
    // registration tokens.
    if (organization.permissions.agentTokenView.allowed) {
      return (
        <div className="clearfix mxn3">
          <div className="sm-col sm-col-8 px3">
            <QuickStart organization={organization} />
            <Agents organization={organization} />
          </div>
          <div className="sm-col sm-col-4 px3">
            <AgentTokens organization={organization} />
          </div>
        </div>
      );
    } else {
      return (
        <Agents organization={organization} />
      );
    }
  }
}

export default Relay.createContainer(AgentIndex, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        ${QuickStart.getFragment('organization')}
        ${AgentTokens.getFragment('organization')}
        ${Agents.getFragment('organization')}
        name
        permissions {
          agentTokenView {
            allowed
          }
        }
      }
    `
  }
});
