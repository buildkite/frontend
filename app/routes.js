import React from 'react';
import Relay from 'react-relay';
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

// The components used in the router
import Main from './components/Main';
import SectionLoader from './components/shared/SectionLoader';
import APIAccessTokenCodeAuthorize from './components/api_access_token_code/APIAccessTokenCodeAuthorize';
import BuildCommentsList from './components/build/CommentsList';
import OrganizationShow from './components/organization/Show';
import OrganizationSettingsSection from './components/organization/SettingsSection';
import AgentIndex from './components/agent/Index';
import AgentShow from './components/agent/Show';
import TeamIndex from './components/team/Index';
import TeamNew from './components/team/New';
import TeamShow from './components/team/Show';
import TeamEdit from './components/team/Edit';
import PipelineScheduleIndex from './components/pipeline/schedules/Index';
import PipelineScheduleNew from './components/pipeline/schedules/New';
import PipelineScheduleShow from './components/pipeline/schedules/Show';
import PipelineScheduleEdit from './components/pipeline/schedules/Edit';
import PipelineTeamIndex from './components/pipeline/teams/Index';

import * as AgentQuery from './queries/Agent';
import * as BuildQuery from './queries/Build';
import * as OrganizationQuery from './queries/Organization';
import * as PipelineQuery from './queries/Pipeline';
import * as PipelineScheduleQuery from './queries/PipelineSchedule';
import * as TeamQuery from './queries/Team';
import * as ViewerQuery from './queries/Viewer';
import * as APIAccessTokenCodeQuery from './queries/APIAccessTokenCode';

const renderSectionLoading = (route) => {
  if (!route.props) {
    return (
      <SectionLoader />
    );
  }

  return React.cloneElement(route.element, route.props);
};

// Only require the `organization` fragment if there's an ":organization"
// param in the URL
const getMainQueries = ({ params }) => {
  if (params.organization) {
    return {
      viewer: ViewerQuery.query,
      organization: OrganizationQuery.query
    };
  } else {
    return {
      viewer: ViewerQuery.query
    };
  }
};

// Since you can't pass `undefined` as a property to a Relay.Container, and
// not all pages have the `organization` available, we need to change it to
// `null` if it's not available.
const renderMain = (route) => {
  if (route.props) {
    route.props.organization = route.props.organization || null;

    return React.cloneElement(route.element, route.props);
  }
};

export default (
  <Router history={browserHistory} render={applyRouterMiddleware(useRelay)} environment={Relay.Store}>
    <Route path="/:organization/:pipeline/builds/:number" component={BuildCommentsList} queries={{ viewer: ViewerQuery.query, build: BuildQuery.query }} prepareParams={BuildQuery.prepareParams} />

    <Route path="/" component={Main} getQueries={getMainQueries} render={renderMain}>
      <Route path="authorize/:code" component={APIAccessTokenCodeAuthorize} queries={{ apiAccessTokenCode: APIAccessTokenCodeQuery.query }} />
      <Route path=":organization" component={OrganizationShow} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />

      <Route path="organizations/:organization">
        <Route path="agents">
          <IndexRoute component={AgentIndex} queries={{ viewer: ViewerQuery.query, organization: OrganizationQuery.query }} />
          <Route path=":agent" component={AgentShow} queries={{ agent: AgentQuery.query }} prepareParams={AgentQuery.prepareParams} />
        </Route>
        <Route path="teams" component={OrganizationSettingsSection} queries={{ organization: OrganizationQuery.query }}>
          <IndexRoute component={TeamIndex} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path="new" component={TeamNew} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path=":team" component={TeamShow} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading} />
          <Route path=":team/edit" component={TeamEdit} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading} />
        </Route>
      </Route>

      <Route path="/:organization/:pipeline/settings/schedules">
        <IndexRoute component={PipelineScheduleIndex} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
        <Route path="new" component={PipelineScheduleNew} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
        <Route path=":schedule" component={PipelineScheduleShow} queries={{ pipelineSchedule: PipelineScheduleQuery.query }} prepareParams={PipelineScheduleQuery.prepareParams} render={renderSectionLoading} />
        <Route path=":schedule/edit" component={PipelineScheduleEdit} queries={{ pipelineSchedule: PipelineScheduleQuery.query }} prepareParams={PipelineScheduleQuery.prepareParams} render={renderSectionLoading} />
      </Route>

      <Route path="/:organization/:pipeline/settings/teams">
        <IndexRoute component={PipelineTeamIndex} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
      </Route>
    </Route>
  </Router>
);
