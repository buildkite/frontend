import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Bugsnag from 'bugsnag-js';

require("./css/main.css");

if (window._standalone) {
  // Reset includes all the styles needed if bootstrap.css isn't loaded on the page
  require("./css/reset.css");
} else {
  // Fixes and additions to the old bootstrap styles
  require("./css/legacy.css");
}

// Setup Bugsnag for JS error tracking
if (window._bugsnag) {
  Bugsnag.apiKey = window._bugsnag.apiKey;
  Bugsnag.appVersion = window._bugsnag.appVersion;
  Bugsnag.user = window._bugsnag.user;
  Bugsnag.releaseStage = window._bugsnag.releaseStage;
  Bugsnag.notifyReleaseStages = window._bugsnag.notifyReleaseStages;
}

// Allows old sprockets and inline-javascript to access webpack modules
window["Webpack"] = {
  modules: {
    "react": require("react"),
    "react-dom": require("react-dom"),
    "react-relay": require("react-relay"),
    "react-addons-pure-render-mixin": require("react-addons-pure-render-mixin"),
    "classnames": require("classnames"),
    "moment": require("moment"),
    "object-assign": require("object-assign"),
    "eventemitter3": require("eventemitter3"),
    "autosize": require("autosize"),

    "components/layout/Navigation": require("./components/layout/Navigation").default,
    "components/layout/Footer": require("./components/layout/Footer").default,
    "components/shared/FormTextField": require("./components/shared/FormTextField").default,
    "components/shared/FormTextarea": require("./components/shared/FormTextarea").default,
    "components/shared/FormMarkdownEditorField": require("./components/shared/FormMarkdownEditorField").default,
    "components/shared/CollapsableFormField": require("./components/shared/CollapsableFormField").default,
    "components/shared/Emojify": require("./components/shared/Emojify").default,
    "components/shared/Icon": require("./components/shared/Icon").default,
    "components/organization/AgentsCount": require("./components/organization/AgentsCount").default,
    "components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
    "components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
    "components/PipelinesWelcome": require("./components/organization/Welcome").default,
    "components/pipeline/Teams": require("./components/pipeline/Teams").default,
    "lib/friendlyRelativeTime": require("./lib/friendlyRelativeTime").default,
    "lib/Logger": require("./lib/Logger").default,
    "lib/Emoji": require("./lib/Emoji").default,
    "lib/RelayPreloader": require("./lib/RelayPreloader").default,
    "lib/jobCommandOneliner": require("./lib/jobCommandOneliner").default,
    "queries/Agent": require("./queries/Agent"),
    "queries/Build": require("./queries/Build"),
    "queries/Organization": require("./queries/Organization"),
    "queries/Pipeline": require("./queries/Pipeline"),
    "queries/PipelineSchedule": require("./queries/PipelineSchedule"),
    "queries/Team": require("./queries/Team"),
    "queries/Viewer": require("./queries/Viewer"),
    "stores/PusherStore": require("./stores/PusherStore").default
  },

  require: function(module) {
    const exported = window["Webpack"].modules[module];

    if (exported) {
      return exported;
    } else {
      throw "No webpack module exported `" + module + "`";
    }
  }
};

// Configure relay if we have access to the GraphQL URL
if (window._graphql) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(window._graphql["url"], { credentials: "same-origin", headers: window._graphql["headers"] })
  );
}

// Setup the PusherStore
if (window._pusher) {
  const PusherStore = require("./stores/PusherStore").default;
  PusherStore.configure(window._pusher["key"], window._pusher["options"]);
  for (const channel of window._pusher["channels"]) {
    PusherStore.listen(channel);
  }
}

// Toggle on development features
if (process.env.NODE_ENV !== "production") {
  require("./lib/Logger").default.enable();
  require('react-relay/lib/RelayNetworkDebug').init();
  window.Perf = require("react-addons-perf");
}

// Only do the react-router gear on pages we've designated
window["initializeReactRouter"] = function() {
  // Require the packages we need to setup routing
  const Router = require("react-router").Router;
  const Route = require("react-router").Route;
  const IndexRoute = require("react-router").IndexRoute;
  const browserHistory = require("react-router").browserHistory;
  const applyRouterMiddleware = require("react-router").applyRouterMiddleware;
  const useRelay = require('react-router-relay');

  // The components used in the router
  const Main = require("./components/Main").default;
  const SectionLoader = require("./components/shared/SectionLoader").default;
  const APIAccessTokenCodeAuthorize = require("./components/api_access_token_code/APIAccessTokenCodeAuthorize").default;
  const BuildCommentsList = require("./components/build/CommentsList").default;
  const OrganizationShow = require("./components/organization/Show").default;
  const OrganizationSettingsSection = require("./components/organization/SettingsSection").default;
  const AgentIndex = require("./components/agent/Index").default;
  const AgentShow = require("./components/agent/Show").default;
  const TeamIndex = require("./components/team/Index").default;
  const TeamNew = require("./components/team/New").default;
  const TeamShow = require("./components/team/Show").default;
  const TeamEdit = require("./components/team/Edit").default;
  const PipelineScheduleIndex = require("./components/pipeline/schedules/Index").default;
  const PipelineScheduleNew = require("./components/pipeline/schedules/New").default;
  const PipelineScheduleShow = require("./components/pipeline/schedules/Show").default;
  const PipelineScheduleEdit = require("./components/pipeline/schedules/Edit").default;

  const AgentQuery = require("./queries/Agent");
  const BuildQuery = require("./queries/Build");
  const OrganizationQuery = require("./queries/Organization");
  const PipelineQuery = require("./queries/Pipeline");
  const PipelineScheduleQuery = require("./queries/PipelineSchedule");
  const TeamQuery = require("./queries/Team");
  const ViewerQuery = require("./queries/Viewer");
  const APIAccessTokenCodeQuery = require("./queries/APIAccessTokenCode");

  const renderSectionLoading = (route) => {
    if (!route.props) {
      return (
        <SectionLoader />
      );
    }

    return React.cloneElement(route.element, route.props);
  };

  // Custom params for pipeline list to support "teams" feature
  const preparePipelineListParams = (params, { location }) => {
    return {
      ...params,
      team: location.query.team || null // Passing `undefined` seems to break all the things
    };
  };

  // Only require the `organization` fragment if there's an ":organization"
  // param in the URL
  const getMainQueries = ({ location, params }) => {
    if(params.organization) {
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
    if(route.props) {
      route.props.organization = route.props.organization || null;

      return React.cloneElement(route.element, route.props);
    }
  };

  // Define and render the routes
  ReactDOM.render(
    <Router history={browserHistory} render={applyRouterMiddleware(useRelay)} environment={Relay.Store}>
      <Route path="/:organization/:pipeline/builds/:number" component={BuildCommentsList} queries={{ viewer: ViewerQuery.query, build: BuildQuery.query }} prepareParams={BuildQuery.prepareParams} />

      <Route path="/" component={Main} getQueries={getMainQueries} render={renderMain}>
        <Route path="authorize/:code" component={APIAccessTokenCodeAuthorize} queries={{ apiAccessTokenCode: APIAccessTokenCodeQuery.query }} />
        <Route path=":organization" component={OrganizationShow} queries={{ organization: OrganizationQuery.query }} prepareParams={preparePipelineListParams} render={renderSectionLoading} />

        <Route path="organizations/:organization">
          <Route path="agents">
            <IndexRoute component={AgentIndex} queries={{ organization: OrganizationQuery.query }} />
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
      </Route>
    </Router>
  , document.getElementById('root'));
};
