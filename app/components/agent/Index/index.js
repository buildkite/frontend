import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../../shared/PageWithContainer';

import Agents from './agents';
import AgentTokens from './agent-tokens';
import AgentInstallation from './installation';
import QuickStart from './quick-start';

class AgentIndex extends React.Component {
  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.object
    }).isRequired,
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.shape({
        agentTokenView: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired,
    viewer: React.PropTypes.object.isRequired
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
    // Switches between showing just the agents, or the agents along with
    // registration tokens.
    if (this.props.organization.permissions.agentTokenView.allowed) {
      if (this.props.location.query.setup == 'true') {
        return (
          <div className="clearfix mxn3 md-col-9 lg-col-8 mx-auto">
            <QuickStart
              title="Select the environment to set up your first agent"
              center={false}
              organization={this.props.organization}
              viewer={this.props.viewer}
              location={this.props.location}
            />
            <AgentInstallation organization={this.props.organization} />
            <AgentTokens
              title="Your agent token"
              organization={this.props.organization}
            />
          </div>
        );
      }

      return (
        <div className="clearfix mxn3">
          <div className="sm-col sm-col-8 px3">
            <QuickStart
              organization={this.props.organization}
              viewer={this.props.viewer}
              location={this.props.location}
            />
            <Agents organization={this.props.organization} />
          </div>
          <div className="sm-col sm-col-4 px3">
            <AgentTokens organization={this.props.organization} />
          </div>
        </div>
      );
    } else {
      return (
        <Agents organization={this.props.organization} />
      );
    }
  }
}

export default Relay.createContainer(AgentIndex, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${QuickStart.getFragment('viewer')}
      }
    `,
    organization: () => Relay.QL`
      fragment on Organization {
        ${Agents.getFragment('organization')}
        ${AgentTokens.getFragment('organization')}
        ${AgentInstallation.getFragment('organization')}
        ${QuickStart.getFragment('organization')}
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
