// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay/compat';
import SectionLoader from 'app/components/shared/SectionLoader';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';
import UserSessionStore from 'app/stores/UserSessionStore';
import Pipeline from './Pipeline';
import Welcome from './Welcome';
import * as constants from './constants';
import type { RelayRefetchProp } from 'react-relay';
import type { Pipelines_organization } from './__generated__/Pipelines_organization.graphql';

type Props = {
  relay: RelayRefetchProp,
  teamFilter: string,
  nameFilter: string,
  organization: Pipelines_organization
};

type State = {
  loading: boolean,
  loadingMore: boolean,
  pageSize: number,
  includeGraphData: boolean
};

class Pipelines extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    loading: false,
    loadingMore: false,
    pageSize: constants.PIPELINES_INITIAL_PAGE_SIZE,
    includeGraphData: false
  };

  get useLocalSearch() {
    return (
      this.props.organization.pipelines &&
      this.props.organization.allPipelines &&
      this.props.organization.allPipelines.count <= constants.PIPELINES_INITIAL_PAGE_SIZE
    );
  }

  get useRemoteSearch() {
    return !this.useLocalSearch;
  }

  get pipelines() {
    return (
      this.props.organization.pipelines &&
      this.props.organization.pipelines.edges
    ) ? this.props.organization.pipelines.edges : [];
  }

  componentDidMount() {
    this.props.relay.refetch((lastVars) => ({ ...lastVars, includeGraphData: true }), null, () => {
      this.setState({ includeGraphData: true });
    });

    // We might've started out with a new team, so let's see about updating the default!
    this.maybeUpdateDefaultTeam(this.props.organization.id, this.props.teamFilter);
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextVars = {};

    // Are we filtering, and can we do this locally?
    if (this.props.nameFilter !== nextProps.nameFilter && this.useRemoteSearch) {
      // if not, go to the server
      nextVars.pipelineFilter = nextProps.nameFilter;
    }

    if (Object.keys(nextVars).length > 0) {
      // Start by changing the `loading` state to show the spinner
      this.setState({ loading: true }, () => {
        // Once state has been set, force a full re-fetch of the pipelines
        this.props.relay.refetch((lastVars) => ({ ...lastVars, ...nextVars }), null, () => {
          this.setState({ loading: false });
        });
      });
    }

    // Let's try updating the default team - we don't rely on the last team
    // being different here because the store might've gotten out of sync,
    // and we do out own check!
    this.maybeUpdateDefaultTeam(nextProps.organization.id, nextProps.teamFilter);
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
    const filter = (this.props.nameFilter || '').toLowerCase().trim();

    // if we're searching remotely, or there's no filter, it's all of 'em, baby
    if (this.useRemoteSearch || !this.props.nameFilter || !filter) {
      return this.pipelines;
    }

    // otherwise, let's filter 'em
    return this.pipelines.filter((pipeline) => (
      pipeline &&
      pipeline.node &&
      (
        pipeline.node.name.toLowerCase().indexOf(filter) !== -1 ||
        // $FlowExpectError
        pipeline.node.description && pipeline.node.description.toLowerCase().indexOf(filter) !== -1
      )
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
    } else if (this.props.nameFilter) {
      return (
        <p className="semi-bold my4 center" style={{ paddingBottom: 1 }}>
          {`No pipelines matching “${this.props.nameFilter}”`}
        </p>
      );
    }

    return (
      <Welcome
        organization={this.props.organization}
        team={this.props.teamFilter}
      />
    );
  }

  renderPipelines(relevantPipelines) {
    // Split the pipelines into "favorited" and non "favorited". We don't
    // user a `sort` method so we preserve the current order the pipelines.
    const [favorited, remainder] = relevantPipelines.reduce((pipelines, pipeline) => {
      if (pipeline && pipeline.node) {
        pipelines[pipeline.node.favorite ? 0 : 1].push(
          <Pipeline
            key={pipeline.node.id}
            pipeline={pipeline.node}
            includeGraphData={this.state.includeGraphData}
          />
        );
      }
      return pipelines;
    }, [[], []]);

    if (favorited.length > 0 && remainder.length > 0) {
      return (
        <>
          {favorited}
          <hr key="seperator" className="my4 bg-gray mx-auto max-width-1 border-none height-0" style={{ height: 1 }} />
          {remainder}
        </>
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
    const pageSize = this.state.pageSize + constants.PIPELINES_PAGE_SIZE;
    this.setState({ loadingMore: true, pageSize }, () => {
      this.props.relay.refetch((lastVars) => ({ ...lastVars, pageSize, includeGraphData: true }), null, () => {
        this.setState({ loadingMore: false });
      });
    });
  }
}

export default createRefetchContainer(
  Pipelines,
  graphql`
    fragment Pipelines_organization on Organization @argumentDefinitions(
      teamSearch: {type: "TeamSelector"}
      pageSize: {type: "Int", defaultValue: 30}
      pipelineFilter: {type: "String"}
      includeGraphData: {type: "Boolean", defaultValue: false}
    ) {
      ...Welcome_organization
      id
      slug
      allPipelines: pipelines(team: $teamSearch) {
        count
      }
      pipelines(
        search: $pipelineFilter
        first: $pageSize
        team: $teamSearch
        order: NAME_WITH_FAVORITES_FIRST
      ) {
        ...ShowMoreFooter_connection
        edges {
          node {
            id
            name
            description
            favorite
            ...Pipeline_pipeline @arguments(includeGraphData: $includeGraphData)
          }
        }
      }
    }
  `,
  graphql`
    query PipelinesRefetchQuery(
      $organizationSlug: ID!
      $teamSearch: TeamSelector
      $includeGraphData: Boolean!
      $pageSize: Int!
      $pipelineFilter: String
    ) {
      organization(slug: $organizationSlug) {
        ...Pipelines_organization @arguments(
          teamSearch: $teamSearch
          includeGraphData: $includeGraphData
          pageSize: $pageSize
          pipelineFilter: $pipelineFilter
        )
      }
    }
  `
);
