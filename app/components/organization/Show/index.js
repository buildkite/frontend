import React from 'react';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../../shared/PageWithContainer';
import RelayBridge from '../../../lib/RelayBridge';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';

import Pipeline from './pipeline';

class Show extends React.Component {
  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <PageWithContainer>
          {this._renderHeader()}
          {this._renderPipelines()}
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  _renderHeader() {
    return (
      <div className="flex">
        <div className="mr-auto">
          <h1>Pipelines</h1>
        </div>
        <div>
          <Button href={`organizations/${this.props.organization.slug}/pipelines/new`}>
            <Icon icon="plus-circle" title="New Pipeline"/>
          </Button>
        </div>
      </div>
    )
  }

  _renderPipelines() {
    return this.props.organization.pipelines.edges.map((edge) =>
      <Pipeline key={edge.node.id} pipeline={edge.node} />
    )
  }
}

export default RelayBridge.createContainer(Show, {
  organization: (props) => `organization/${props.params.organization}`
});
