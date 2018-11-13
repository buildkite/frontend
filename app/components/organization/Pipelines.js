// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import SectionLoader from 'app/components/shared/SectionLoader';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';

import FlashesStore from 'app/stores/FlashesStore';
import UserSessionStore from 'app/stores/UserSessionStore';

import Pipeline from './Pipeline';
import Welcome from './Welcome';

const INITIAL_PAGE_SIZE = 30;
const PAGE_SIZE = 50;

class OrganizationPipelines extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      allPipelines: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      pipelines: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      })
    }),
    relay: PropTypes.object.isRequired,
    team: PropTypes.string,
    filter: PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    loading: false,
    loadingMore: false
  };

  get useLocalSearch() {
    return this.props.organization.pipelines &&
      this.props.organization.allPipelines.count <= INITIAL_PAGE_SIZE &&
      !this.props.relay.variables.pipelineFilter;
  }

  get useRemoteSearch() {
    return !this.useLocalSearch;
  }

  componentDidMount() {
    // After the `OrganizationPipelines` component has mounted, kick off a
    // Relay query to load in all the pipelines. `includeGraphData` is still
    // false at this point because we'll load in that data after this.
    this.props.relay.setVariables(
      {
        isMounted: true,
        teamSearch: this.props.team,
        pipelineFilter: this.props.filter
      },
      ({ done, error }) => {
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
              //
              // NOTE: We check `aborted` as well as `done` because it *should* return `done` but
              // it looks like if it's canceled during a query it'll return `aborted` but render
              // the right data.
              if (readyState.aborted || readyState.done) {
                FlashesStore.flash(FlashesStore.ERROR, "The requested team couldn’t be found! Switched back to All teams.");
              }
            });
          }
        }
      }
    );

    // We might've started out with a new team, so let's see about updating the default!
    this.maybeUpdateDefaultTeam(this.props.organization.id, this.props.team);
  }

  componentWillReceiveProps(nextProps) {
    const nextRelayVariables = {};

    // Are we switching teams?
    if (this.props.team !== nextProps.team) {
      nextRelayVariables.teamSearch = nextProps.team;
    }

    // Are we filtering, and can we do this locally?
    if (this.props.filter !== nextProps.filter && this.useRemoteSearch) {
      // if not, go to the server
      nextRelayVariables.pipelineFilter = nextProps.filter;
    }

    if (Object.keys(nextRelayVariables).length > 0) {
      // Start by changing the `loading` state to show the spinner
      this.setState(
        { loading: true },
        () => {
          // Once state has been set, force a full re-fetch of the pipelines
          this.props.relay.forceFetch(
            nextRelayVariables,
            ({ done }) => {
              // Now that we've got the data, turn off the spinner
              if (done) {
                this.setState({ loading: false });
              }
            }
          );
        }
      );
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

  getRelevantPipelines() {
    const filter = (this.props.filter || '').toLowerCase().trim();

    // if we're searching remotely, or there's no filter, it's all of 'em, baby
    if (this.useRemoteSearch || this.props.relay.variables.pipelineFilter || !filter) {
      return this.props.organization.pipelines.edges;
    }

    // otherwise, let's filter 'em
    return this.props.organization.pipelines.edges.filter(({ node }) => (
      node.name.toLowerCase().indexOf(filter) !== -1 ||
      node.description && node.description.toLowerCase().indexOf(filter) !== -1
    ));
  }

  render() {
    // Are we switching teams or getting the first set of data? Lets bail out
    // early and show the spinner.
    if (this.state.loading || !this.props.organization.pipelines) {
      return (
        <SectionLoader />
      );
    }

    const relevantPipelines = this.getRelevantPipelines();

    // Switch between rendering the actual teams, or showing the "Welcome"
    // message
    if (relevantPipelines.length > 0) {
      return (
        <div>
          {this.renderPipelines(relevantPipelines)}
          <ShowMoreFooter
            connection={this.props.organization.pipelines}
            label="pipelines"
            loading={this.state.loadingMore}
            onShowMore={this.handleShowMorePipelines}
          />
        </div>
      );
    } else if (this.props.filter) {
      return (
        <p className="semi-bold my4 center" style={{ paddingBottom: 1 }}>
          {`No pipelines matching “${this.props.filter}”`}
        </p>
      );
    }

    return (
      <Welcome organization={this.props.organization} team={this.props.team} />
    );
  }

  renderPipelines(relevantPipelines) {
    // Split the pipelines into "favorited" and non "favorited". We don't
    // user a `sort` method so we preserve the current order the pipelines.
    const favorited = [];
    const remainder = [];
    for (const edge of relevantPipelines) {
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

  handleShowMorePipelines = () => {
    this.setState({ loadingMore: true });

    this.props.relay.setVariables(
      {
        pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
      },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loadingMore: false });
        }
      }
    );
  };
}

export default Relay.createContainer(OrganizationPipelines, {
  initialVariables: {
    teamSearch: null,
    includeGraphData: false,
    pageSize: INITIAL_PAGE_SIZE,
    pipelineFilter: null,
    isMounted: false
  },

  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        ${Welcome.getFragment('organization')}
        id
        slug
        allPipelines: pipelines(team: $teamSearch) @include(if: $isMounted) {
          count
        }
        pipelines(search: $pipelineFilter, first: $pageSize, team: $teamSearch, order: NAME_WITH_FAVORITES_FIRST) @include(if: $isMounted) {
          ${ShowMoreFooter.getFragment('connection')}
          edges {
            node {
              id
              name
              favorite
              ${Pipeline.getFragment('pipeline', { includeGraphData: variables.includeGraphData })}
            }
          }
        }
      }
    `
  }
});
