import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

import Pipeline from './Pipeline';

class Show extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      pipelines: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

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
      <div className="flex mb2 items-center">
        <div className="mr-auto">
          <h1 className="h1 m0 regular line-height-1">Pipelines</h1>
        </div>
        <div>
          <Button theme="default" outline={true} className="p0 flex circle items-center justify-center" style={{width:34, height:34}} href={`organizations/${this.props.organization.slug}/pipelines/new`} title="New Pipeline">
            <Icon icon="plus" title="New Pipeline"/>
          </Button>
        </div>
      </div>
    )
  }

  _renderPipelines() {
    return this.props.organization.pipelines.edges.map((edge) =>
      <Pipeline key={edge.node.id} organization={this.props.organization} pipeline={edge.node} />
    )
  }
}

export default Relay.createContainer(Show, {
  initialVariables: {
    team: null
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        id
        slug
        name
        pipelines(first: 100, team: $team) {
          edges {
            node {
              id
              ${Pipeline.getFragment('pipeline')}
            }
          }
        }
      }
    `
  }
});
