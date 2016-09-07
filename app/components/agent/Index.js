import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';

class Index extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <Panel>
          <Panel.Header>Agents</Panel.Header>
        </Panel>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
      }
    `
  }
});
