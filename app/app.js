import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

require("./css/main.css");

// Allows old sprockets and inline-javascript to access webpack modules
window["Webpack"] = {
  modules: {
    "react": require("react"),
    "react-dom": require("react-dom"),
    "relay": require("react-relay"),
    "classnames": require("classnames"),
    "moment": require("moment"),
    "object-assign": require("object-assign"),
    "eventemitter3": require("eventemitter3"),

    "components/layout/Navigation": require("./components/layout/Navigation").default,
    "components/shared/FormTextField": require("./components/shared/FormTextField").default,
    "components/shared/FormMarkdownEditorField": require("./components/shared/FormMarkdownEditorField").default,
    "components/shared/CollapsableFormField": require("./components/shared/CollapsableFormField").default,
    "components/shared/Emojify": require("./components/shared/Emojify").default,
    "components/organization/AgentsCount": require("./components/organization/AgentsCount").default,
    "components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
    "components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
    "components/PipelinesWelcome": require("./components/PipelinesWelcome").default,
    "stores/PusherStore": require("./stores/PusherStore").default,
    "lib/friendlyRelativeTime": require("./lib/friendlyRelativeTime").default,
    "lib/Logger": require("./lib/Logger").default,
    "lib/Emoji": require("./lib/Emoji").default
  },

  require: function(module) {
    let exported = window["Webpack"].modules[module]

    if(exported) {
      return exported
    } else {
      throw "No webpack module exported `" + module + "`"
    }
  }
}

// Configure relay if we have access to the GraphQL URL
if(window._graphql) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(window._graphql['url'], { headers: { 'Authorization': window._graphql['authorization'] } })
  );
}

// Only do the react-router gear on pages we've designated
window["initializeReactRouter"] = function() {
  // Require the packages we need to setup routing
  let Route = require("react-router").Route;
  let IndexRoute = require("react-router").IndexRoute;
  let browserHistory = require("react-router").browserHistory;
  let RelayRouter = require('react-router-relay').RelayRouter;

  // The components used in the router
  let BuildCommentsList = require("./components/build/CommentsList").default;
  let OrganizationSettingsSection = require("./components/organization/SettingsSection").default;
  let TeamList = require("./components/team/List").default;
  let TeamNew = require("./components/team/New").default;
  let PageLoader = require("./components/shared/PageLoader").default;

  // Queries used when you want to show a build
  const BuildQueries = {
    viewer: () => Relay.QL`
      query {
	viewer
      }
    `,
    build: () => Relay.QL`
      query {
	build(slug: $slug)
      }
    `
  };

  // When you want to show something related to an organization
  const OrganizationQueries = {
    organization: () => Relay.QL`
      query {
	organization(slug: $organization)
      }
    `
  }

  // Since relay doesn't currently support root fields with multiple
  // parameters, it means we can't have queries like: build(org: "...",
  // pipeline: "...", number: "12"), so we have to do this hacky thing where we
  // include them all in the `slug` param.
  function prepareBuildParams(params) {
    return {
      ...params,
      slug: [ params.organization, params.pipeline, params.number ].join("/")
    };
  }

  // Define and render the routes
  ReactDOM.render(
    <RelayRouter history={browserHistory}>
      <Route path="/:organization/:pipeline/builds/:number" component={BuildCommentsList} queries={BuildQueries} prepareParams={prepareBuildParams} />

      <Route path="/">
	<Route path="organizations/:organization" component={OrganizationSettingsSection} queries={OrganizationQueries} renderLoading={() => <PageLoader />}>
	  <Route path="teams">
	    <IndexRoute component={TeamList} queries={OrganizationQueries} renderLoading={() => <PageLoader />} />
            <Route path="new" component={TeamNew} queries={OrganizationQueries} renderLoading={() => <PageLoader />} />
	  </Route>
	</Route>
      </Route>
    </RelayRouter>
  , document.getElementById('root'));
}
