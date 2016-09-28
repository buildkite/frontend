import React from 'react';
import Relay from 'react-relay';

import SectionLoader from '../shared/SectionLoader';

import Welcome from './Welcome';
import Pipeline from './Pipeline';

class OrganizationPipelines extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
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
    }).isRequired
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.organization.pipelines && this.props.organization.pipelines.edges.length > 0) {
      if(this.props.forceGraphDataFetch != nextProps.forceGraphDataFetch) {
        // this.props.relay.forceFetch({ includeGraphData: true })
      }
    }
  }

  // Don't bother doing another render when we're just changing the
  // `forceGraphDataFetch` property
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.forceGraphDataFetch != nextProps.forceGraphDataFetch) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    if (this.props.organization.pipelines) {
      if (this.props.organization.pipelines.edges.length > 0) {
        // Split the pipelines into "favorited" and non "favorited". We don't
        // user a `sort` method so we preserve the current order the pipelines.
        const favorited = [];
        const remainder = [];
        for (const edge of this.props.organization.pipelines.edges) {
          if (edge.node.favorite) {
            favorited.push(edge.node);
          } else {
            remainder.push(edge.node);
          }
        }

        const nodes = [];

        // Put the favorites in the own section with a divider
        if (favorited.length > 0) {
          for (const pipeline of favorited) {
            nodes.push(
              <Pipeline key={pipeline.id} pipeline={pipeline} includeGraphData={this.props.relay.variables.includeGraphData} />
            );
          }

          if (remainder.length > 0) {
            nodes.push(
              <hr key="seperator" className="my4 bg-gray mx-auto max-width-1 border-none height-0" style={{ height: 1 }} />
            );
          }
        }

        for (const pipeline of remainder) {
          nodes.push(<Pipeline key={pipeline.id} pipeline={pipeline} includeGraphData={this.props.relay.variables.includeGraphData} />);
        }

        return (
          <div>{nodes}</div>
        );
      } else {
        return (
          <Welcome organization={this.props.organization.slug} />
        );
      }
    } else {
      return <SectionLoader />;
    }
  }
}

export default Relay.createContainer(OrganizationPipelines, {
  initialVariables: {
    team: null,
    includeGraphData: false
  },

  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        slug
        pipelines(first: 100, team: $team, order: PIPELINE_ORDER_NAME) {
          edges {
            node {
              id
              favorite
              ${Pipeline.getFragment('pipeline', { includeGraphData: variables.includeGraphData })}
            }
          }
        }
      }
    `
  }
});
