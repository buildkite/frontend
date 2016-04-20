import React from 'react';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../../shared/PageWithContainer';
import RelayBridge from '../../../lib/RelayBridge';

import Pipeline from './pipeline';

class Show extends React.Component {
  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <PageWithContainer>
          <h1>Pipelines</h1>
          <a href={`organizations/${this.props.organization.slug}/pipelines/new`}>New Pipeline</a>

          {this.props.organization.pipelines.edges.map((edge) => <Pipeline key={edge.node.id} pipeline={edge.node} />)}
        </PageWithContainer>
      </DocumentTitle>
    );
  }
}

export default RelayBridge.createContainer(Show, {
  organization: (props) => `organization/${props.params.organization}`
});
