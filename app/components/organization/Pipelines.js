import React from 'react';
import Relay from 'react-relay';

import SectionLoader from '../shared/SectionLoader';

import Pipeline from './Pipeline';
import Teams from './Teams';
import Welcome from './Welcome';

class OrganizationPipelines extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      pipelines: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      })
    }),
    relay: React.PropTypes.object.isRequired,
    team: React.PropTypes.string
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidUpdate(prevProps) {
    if(prevProps.organization != this.props.organization) {
      //this.props.relay.setVariables({ team: this.props.team }, ({ ready }) => {
      //  console.log('pipelines has loaded', ready);
      //});
    } else if(prevProps.team != this.props.team) {
      // this.props.relay.forceFetch({ includeGraphData: false, teamSearch: this.props.team }, ({ ready }) => {
      //   console.log(ready);
      // });
    }
  }

  render() {

    console.log("PIPELINE RENDER ", this.props.organization, this.props.organization.pipelines);

    if (this.props.organization && this.props.organization.pipelines) {
      if (this.props.organization.pipelines.edges.length > 0) {
        return (
          <div>
            {this.renderPipelines()}
          </div>
        )
      } else {
        return (
          <Welcome organization={this.props.params.organization} />
        );
      }
    } else {
      return (
        <SectionLoader />
      );
    }
  }

  renderPipelines() {
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

    return nodes;
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
        pipelines(first: 100, team: $team, order: PIPELINE_ORDER_NAME) {
          edges {
            node {
              id
              favorite
              ${Pipeline.getFragment('pipeline')
            }
          }
        }
      }
    `
  }
});
