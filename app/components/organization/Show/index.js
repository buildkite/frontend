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
          <h1 class="m0">Pipelines</h1>
        </div>
        <div>
          <Button theme="default" outline={true} className="p0 flex circle items-center justify-center" style={{width:34,height:34}} href={`organizations/${this.props.organization.slug}/pipelines/new`} title="New Pipeline">
            <Icon icon="plus" title="New Pipeline"/>
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
