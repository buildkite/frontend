import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithCenterContent from '../shared/PageWithCenterContent';
import Panel from '../shared/Panel'
import Emojify from '../shared/Emojify';

class Show extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        slug: React.PropTypes.string.isRequired
      }).isRequired
    })
  };

  render() {
    return (
      <DocumentTitle title={`${this.props.agent.name} · ${this.props.agent.organization.name}`}>
        <PageWithCenterContent>
          <Panel>
            <Panel.Header><Emojify text={this.props.agent.name} /></Panel.Header>
          </Panel>
        </PageWithCenterContent>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(Show, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        name
        organization {
          name
          slug
        }
      }
    `
  }
});
