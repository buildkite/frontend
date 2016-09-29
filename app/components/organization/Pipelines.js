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

  state = {
    fetching: false
  }

  componentDidMount() {
    // After the `OrganizationPipelines` component has mounted, kick off a
    // Relay query to load in all the pipelines. `includeGraphData` is still
    // false at this point because we'll load in that data after this.
    this.props.relay.setVariables({ isMounted: true, teamSearch: this.props.team }, (readyState) => {
      if (readyState.done) {
        // Now kick off a full reload, which will grab the pipelines again, but
        // this time with all the graph data.
        setTimeout(() => {
          this.props.relay.forceFetch({ includeGraphData: true });
        }, 0);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // Are we switching teams?
    if (this.props.team != nextProps.team) {
      // Start by changing the `fetching` state to show the spinner
      this.setState({ fetching: true }, () => {
        // Once state has been set, force a full re-fetch of the pipelines in
        // the new team
        this.props.relay.forceFetch({ teamSearch: nextProps.team }, (readyState) => {
          // Now that we've got the data, turn off the spinner
          if (readyState.done) {
            this.setState({ fetching: false });
          }
        });
      });
    }
  }

  render() {
    // Are we switching teams or getting the first set of data? Lets bail out
    // early and show the spinner.
    if (this.state.fetching || !this.props.organization.pipelines) {
      return (
        <SectionLoader />
      );
    }

    // Switch between rendering the actual teams, or showing the "Welcome"
    // message
    if (this.props.organization.pipelines.edges.length > 0) {
      return (
        <div>
          {this.renderPipelines()}
        </div>
      );
    } else {
      return (
        <Welcome organization={this.props.params.organization} />
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
    teamSearch: null,
    includeGraphData: false,
    isMounted: false
  },

  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        pipelines(first: 100, team: $teamSearch, order: PIPELINE_ORDER_NAME) @include(if: $isMounted) {
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
