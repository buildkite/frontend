import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import SectionLoader from '../shared/SectionLoader';

import Pipeline from './Pipeline';
import Teams from './Teams';

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
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    team: React.PropTypes.string
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  // When we change teams, it causes a new set of variables to be loaded (I'm
  // not sure why, something in react-router-relay probably) so we'll keep an
  // eye out of team changes, and reset `isMounted`
  componentDidUpdate(prevProps) {
    if(prevProps.team != this.props.team) {
      this.props.relay.setVariables({ isMounted: true });
    }
  }

  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <PageWithContainer>
          <div className="flex mb2 items-start">
            <div className="mr-auto flex items-start">
              <h1 className="h1 p0 m0 mr4 regular line-height-1 inline-block">Pipelines</h1>
              <Teams selected={this.props.relay.variables.team} organization={this.props.organization} onTeamChange={this.handleTeamChange} />
            </div>
            <Button theme="default" outline={true} className="p0 flex circle items-center justify-center" style={{width:34, height:34}} href={`organizations/${this.props.organization.slug}/pipelines/new`} title="New Pipeline">
              <Icon icon="plus" title="New Pipeline"/>
            </Button>
          </div>

          {this.renderPipelines()}
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderPipelines() {
    if(this.props.organization.pipelines) {
      // Split the pipelines into "favorited" and non "favorited". We don't
      // user a `sort` method so we preserve the current order the pipelines.
      let favorited = [];
      let remainer = [];
      for(let edge of this.props.organization.pipelines.edges) {
        if(edge.node.favorite) {
          favorited.push(edge.node);
        } else {
          remainer.push(edge.node);
        }
      }

      // Render the pipelines with the favorites first
      return favorited.concat(remainer).map((pipeline) =>
        <Pipeline key={pipeline.id} pipeline={pipeline} />
      )
    } else {
      return <SectionLoader />
    }
  }

  handleTeamChange = (slug) => {
    // Prevent ugly URL's that look like "/acme-inc?team="
    if(slug) {
      this.context.router.push(`/${this.props.organization.slug}?team=${slug}`);
    } else {
      this.context.router.push(`/${this.props.organization.slug}`);
    }
  };
}

export default Relay.createContainer(Show, {
  initialVariables: {
    team: null,
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        id
        slug
        name
        ${Teams.getFragment('organization')}
        pipelines(first: 100, team: $team, order: PIPELINE_ORDER_NAME) @include(if: $isMounted) {
          edges {
            node {
              id
              favorite
              ${Pipeline.getFragment('pipeline')}
            }
          }
        }
      }
    `
  }
});
