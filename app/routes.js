// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import useRelay from 'react-router-relay';
import {
  Router,
  Route, Redirect, IndexRoute, IndexRedirect,
  browserHistory, applyRouterMiddleware
} from 'react-router';

// The components used in the router
import Main from './components/Main';
import SectionLoader from './components/shared/SectionLoader';
import APIAccessTokenCodeAuthorize from './components/api_access_token_code/APIAccessTokenCodeAuthorize';
import BuildCommentsList from './components/build/CommentsList';
import OrganizationShow from './components/organization/Show';
import OrganizationSettingsSection from './components/organization/SettingsSection';
import AgentIndex from './components/agent/Index';
import AgentShow from './components/agent/Show';
import AgentJobs from './components/agent/Jobs';
import TeamIndex from './components/team/Index';
import TeamNew from './components/team/TeamNew';
import TeamShow from './components/team/Show';
import TeamMembers from './components/team/Members';
import TeamPipelines from './components/team/Pipelines';
import TeamEdit from './components/team/Edit';

import MemberIndex from './components/member/Index';
import MemberNew from './components/member/New';
import MemberShow from './components/member/Show';
import MemberEdit from './components/member/Edit';
import MemberTeams from './components/member/Teams';

import SSOIndex from './components/sso/Index';
import PipelineSettingsSection from './components/pipeline/SettingsSection';
import PipelineScheduleIndex from './components/pipeline/schedules/Index';
import PipelineScheduleNew from './components/pipeline/schedules/New';
import PipelineScheduleShow from './components/pipeline/schedules/Show';
import PipelineScheduleEdit from './components/pipeline/schedules/Edit';
import PipelineTeamIndex from './components/pipeline/teams/Index';
import PipelineNewTeams from './components/pipeline/New/PipelineNewTeams';
import AuditLogSection from './components/audit_log/Section';
import AuditLogIndex from './components/audit_log/Index';
import AuditLogExport from './components/audit_log/Export';
import JobIndex from './components/job/Index';
import BillingUpgrade from './components/billing/BillingUpgrade';

import TwoFactorIndex from './components/user/TwoFactor';
import TwoFactorConfigure from './components/user/TwoFactor/TwoFactorConfigure';
import TwoFactorDelete from './components/user/TwoFactor/TwoFactorDelete';

import GraphQLExplorer from './components/user/graphql/GraphQLExplorer';
import GraphQLExplorerConsole from './components/user/graphql/GraphQLExplorerConsole';
import GraphQLExplorerDocumentation from './components/user/graphql/GraphQLExplorerDocumentation';
import GraphQLExplorerDocumentationQuery from './components/user/graphql/GraphQLExplorerDocumentationQuery';
import GraphQLExplorerDocumentationMutation from './components/user/graphql/GraphQLExplorerDocumentationMutation';
import GraphQLExplorerExamples from './components/user/graphql/GraphQLExplorerExamples';

import * as AgentQuery from './queries/Agent';
import * as BuildQuery from './queries/Build';
import * as OrganizationQuery from './queries/Organization';
import * as OrganizationMemberQuery from './queries/OrganizationMember';
import * as PipelineQuery from './queries/Pipeline';
import * as PipelineScheduleQuery from './queries/PipelineSchedule';
import * as TeamQuery from './queries/Team';
import * as ViewerQuery from './queries/Viewer';
import * as APIAccessTokenCodeQuery from './queries/APIAccessTokenCode';
import * as GraphQLSnippetQuery from './queries/GraphQLSnippet';

import FlashesStore from './stores/FlashesStore';

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
  }

  return {
    viewer: ViewerQuery.query
  };
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

const routeChangeHandler = () => {
  // Reset flashes on route changes
  FlashesStore.reset();
};

export default (
  <Router history={browserHistory} render={applyRouterMiddleware(useRelay)} environment={Relay.Store}>
    <Route path="/:organization/:pipeline/builds/:number" component={BuildCommentsList} queries={{ viewer: ViewerQuery.query, build: BuildQuery.query }} prepareParams={BuildQuery.prepareParams} />
    <Route path="/organizations/:organization/pipelines/new" component={PipelineNewTeams} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
    <Route path="/organizations/:organization/pipelines" component={PipelineNewTeams} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />

    <Route path="/" component={Main} getQueries={getMainQueries} render={renderMain} onChange={routeChangeHandler}>
      <Route path="authorize/:code" component={APIAccessTokenCodeAuthorize} queries={{ apiAccessTokenCode: APIAccessTokenCodeQuery.query }} />
      <Route path=":organization" component={OrganizationShow} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
      <Route path="organizations/:organization/billing/upgrade" component={BillingUpgrade} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />

      <Route path="user">

        {/* $FlowExpectError */}
        {Features.TwoFactorAuthentication ? (
          <Route path="two-factor">
            <IndexRoute component={TwoFactorIndex} queries={{ viewer: ViewerQuery.query }} />
            <Route path="configure" component={TwoFactorConfigure} queries={{ viewer: ViewerQuery.query }} />
            <Route path="delete" component={TwoFactorDelete} queries={{ viewer: ViewerQuery.query }} />
          </Route>
        ) : null}

        <Route path="graphql" component={GraphQLExplorer}>
          <IndexRedirect to="console" />
          <Route path="console">
            <IndexRoute component={GraphQLExplorerConsole} queries={{ viewer: ViewerQuery.query }} />
            <Route path=":snippet" component={GraphQLExplorerConsole} queries={{ viewer: ViewerQuery.query, graphQLSnippet: GraphQLSnippetQuery.query }} />
          </Route>
          <Route path="documentation">
            <IndexRoute component={GraphQLExplorerDocumentation} />
            <Route path="query/:field" component={GraphQLExplorerDocumentationQuery} />
            <Route path="mutation/:field" component={GraphQLExplorerDocumentationMutation} />
          </Route>
          <Route path="examples" component={GraphQLExplorerExamples} queries={{ viewer: ViewerQuery.query }} />
        </Route>
      </Route>

      <Route path="organizations/:organization">
        <Route path="jobs">
          <IndexRoute component={JobIndex} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
        </Route>
        <Route path="agents">
          <IndexRoute component={AgentIndex} queries={{ viewer: ViewerQuery.query, organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path=":agent" component={AgentShow} queries={{ agent: AgentQuery.query }} prepareParams={AgentQuery.prepareParams} render={renderSectionLoading} />
          <Route path=":agent/jobs" component={AgentJobs} queries={{ agent: AgentQuery.query }} prepareParams={AgentQuery.prepareParams} render={renderSectionLoading} />
        </Route>
        <Route path="audit-log" component={OrganizationSettingsSection} queries={{ organization: OrganizationQuery.query }}>
          <Route component={AuditLogSection} queries={{ organization: OrganizationQuery.query }}>
            <IndexRoute component={AuditLogIndex} render={renderSectionLoading} queries={{ organization: OrganizationQuery.query }} />
            <Route path="export" component={AuditLogExport} render={renderSectionLoading} queries={{ organization: OrganizationQuery.query }} />
          </Route>
        </Route>
        <Route path="users" component={OrganizationSettingsSection} queries={{ organization: OrganizationQuery.query }}>
          <IndexRoute component={MemberIndex} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path="new" component={MemberNew} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path=":organizationMember" component={MemberShow} queries={{ organizationMember: OrganizationMemberQuery.query }} prepareParams={OrganizationMemberQuery.prepareParams} render={renderSectionLoading}>
            <IndexRedirect to="settings" />

            <Route path="settings" component={MemberEdit} queries={{ viewer: ViewerQuery.query, organizationMember: OrganizationMemberQuery.query }} prepareParams={OrganizationMemberQuery.prepareParams} render={renderSectionLoading} />
            <Route path="teams" component={MemberTeams} queries={{ organizationMember: OrganizationMemberQuery.query }} prepareParams={OrganizationMemberQuery.prepareParams} render={renderSectionLoading} />
          </Route>
        </Route>
        <Route path="teams" component={OrganizationSettingsSection} queries={{ organization: OrganizationQuery.query }}>
          <IndexRoute component={TeamIndex} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path="new" component={TeamNew} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
          <Route path=":team" component={TeamShow} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading}>
            <IndexRedirect to="members" />
            <Redirect from="edit" to="settings" />
            <Route path="settings" component={TeamEdit} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading} />
            <Route path="members" component={TeamMembers} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading} />
            <Route path="pipelines" component={TeamPipelines} queries={{ team: TeamQuery.query }} prepareParams={TeamQuery.prepareParams} render={renderSectionLoading} />
          </Route>
        </Route>
        <Route path="sso" component={OrganizationSettingsSection} queries={{ organization: OrganizationQuery.query }}>
          <IndexRoute component={SSOIndex} queries={{ organization: OrganizationQuery.query }} render={renderSectionLoading} />
        </Route>
      </Route>

      <Route path=":organization/:pipeline/settings" component={PipelineSettingsSection} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams}>
        <Route path="schedules">
          <IndexRoute component={PipelineScheduleIndex} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
          <Route path="new" component={PipelineScheduleNew} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
          <Route path=":schedule" component={PipelineScheduleShow} queries={{ viewer: ViewerQuery.query, pipelineSchedule: PipelineScheduleQuery.query }} prepareParams={PipelineScheduleQuery.prepareParams} render={renderSectionLoading} />
          <Route path=":schedule/edit" component={PipelineScheduleEdit} queries={{ pipelineSchedule: PipelineScheduleQuery.query }} prepareParams={PipelineScheduleQuery.prepareParams} render={renderSectionLoading} />
        </Route>

        <Route path="teams">
          <IndexRoute component={PipelineTeamIndex} queries={{ pipeline: PipelineQuery.query }} prepareParams={PipelineQuery.prepareParams} render={renderSectionLoading} />
        </Route>
      </Route>
    </Route>
  </Router>
);
