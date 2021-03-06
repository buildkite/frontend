// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageWithContainer from 'app/components/shared/PageWithContainer';

import Agents from './agents';
import AgentTokenList from './AgentTokenList';
import AgentInstallation from './installation';
import QuickStart from './quick-start';

type Props = {
  location: {
    query: Object
  },
  organization: {
    name: string
  },
  viewer: Object
};

class AgentIndex extends React.PureComponent<Props> {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.object.isRequired
    }).isRequired,
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    viewer: PropTypes.object.isRequired
  };

  render() {
    let content;
    if (this.props.location.query.setup === 'true') {
      content = this.renderSetupPage();
    } else {
      content = this.renderNormalPage();
    }

    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <PageWithContainer>
          {content}
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderSetupPage() {
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
        <AgentTokenList
          title="Your agent token"
          organization={this.props.organization}
          setupMode={true}
        />
      </div>
    );
  }

  renderNormalPage() {
    return (
      <div className="clearfix mxn3">
        <div className="sm-col sm-col-8 px3">
          <QuickStart
            organization={this.props.organization}
            viewer={this.props.viewer}
            location={this.props.location}
          />
          <Agents organization={this.props.organization} location={this.props.location} />
        </div>
        <div className="sm-col sm-col-4 px3">
          <AgentTokenList organization={this.props.organization} />
        </div>
      </div>
    );
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
        ${AgentTokenList.getFragment('organization')}
        ${AgentInstallation.getFragment('organization')}
        ${QuickStart.getFragment('organization')}
        name
      }
    `
  }
});
