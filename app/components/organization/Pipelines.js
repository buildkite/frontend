import React from 'react';
import Relay from 'react-relay';

import SectionLoader from '../shared/SectionLoader';

import FlashesStore from '../../stores/FlashesStore';
import UserSessionStore from '../../stores/UserSessionStore';

import Pipeline from './Pipeline';
import Welcome from './Welcome';

class OrganizationPipelines extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
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
    }),
    relay: React.PropTypes.object.isRequired,
    team: React.PropTypes.string
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    fetching: false
  }

  componentDidMount() {
    // After the `OrganizationPipelines` component has mounted, kick off a
    // Relay query to load in all the pipelines. `includeGraphData` is still
    // false at this point because we'll load in that data after this.
    this.props.relay.setVariables({ isMounted: true, teamSearch: this.props.team }, ({ done, error }) => {
      if (done) {
        // Now kick off a full reload, which will grab the pipelines again, but
        // this time with all the graph data.
        setTimeout(() => {
          this.props.relay.forceFetch({ includeGraphData: true });
        }, 0);
      } else if (error) {
        // if we couldn't find that team in GraphQL, let's redirect to not requesting a team!
        if (error.source.errors.some(({ message }) => message === 'No team found')) {
          this.context.router.push(`/${this.props.organization.slug}`);
          this.maybeUpdateDefaultTeam(this.props.organization.id, null);
          // WARNING: We need to set isMounted here because it didn't get successfuly
          // updated by the parent setVariables call!
          this.props.relay.setVariables({ isMounted: true, teamSearch: null }, (readyState) => {
            // flash error once we've got data so it behaves more like its backend counterpart!
            if (readyState.done) {
              FlashesStore.flash(FlashesStore.ERROR, "The requested team couldn’t be found! Switched back to All teams.")
            }
          });
        }
      }
    });

    // We might've started out with a new team, so let's see about updating the default!
    this.maybeUpdateDefaultTeam(this.props.organization.id, this.props.team);
  }

  componentWillReceiveProps(nextProps) {
    // Are we switching teams?
    if (this.props.team !== nextProps.team) {
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

    // Let's try updating the default team - we don't rely on the last team
    // being different here because the store might've gotten out of sync,
    // and we do out own check!
    this.maybeUpdateDefaultTeam(nextProps.organization.id, nextProps.team);
  }

  maybeUpdateDefaultTeam(organization, team) {
    const orgDefaultTeamKey = `organization-default-team:${organization}`;

    if (team !== UserSessionStore.get(orgDefaultTeamKey)) {
      if (team) {
        UserSessionStore.set(orgDefaultTeamKey, team);
      } else {
        UserSessionStore.remove(orgDefaultTeamKey);
      }
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
        <Welcome organization={this.props.organization.slug} />
      );
    }
  }

  renderPipelines() {
    // Split the pipelines into "favorited" and non "favorited". We don't
    // user a `sort` method so we preserve the current order the pipelines.
    const favorited = [];
    const remainder = [];
    for (const edge of this.props.organization.pipelines.edges) {
      // Put the favorites in the own section
      if (edge.node.favorite) {
        favorited.push(<Pipeline key={edge.node.id} pipeline={edge.node} includeGraphData={this.props.relay.variables.includeGraphData} />);
      } else {
        remainder.push(<Pipeline key={edge.node.id} pipeline={edge.node} includeGraphData={this.props.relay.variables.includeGraphData} />);
      }
    }

    if (favorited.length > 0 && remainder.length > 0) {
      return favorited.concat(
        [<hr key="seperator" className="my4 bg-gray mx-auto max-width-1 border-none height-0" style={{ height: 1 }} />],
        remainder
      );
    } else if (favorited.length > 0) {
      return favorited;
    } else if (remainder.length > 0) {
      return remainder;
    }

    // Just in case
    return [];
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
        id
        slug
        pipelines(first: 500, team: $teamSearch, order: PIPELINE_ORDER_NAME) @include(if: $isMounted) {
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
