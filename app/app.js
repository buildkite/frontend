import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import Routes from './routes';

require("./css/main.css");

if (window._standalone) {
  // Reset includes all the styles needed if bootstrap.css isn't loaded on the page
  require("./css/reset.css");
} else {
  // Fixes and additions to the old bootstrap styles
  require("./css/legacy.css");
}

// Setup Bugsnag for JS error tracking
if (window.Bugsnag && window._bugsnag) {
  window.Bugsnag.apiKey = window._bugsnag.apiKey;
  window.Bugsnag.appVersion = window._bugsnag.appVersion;
  window.Bugsnag.user = window._bugsnag.user;
  window.Bugsnag.releaseStage = window._bugsnag.releaseStage;
  window.Bugsnag.notifyReleaseStages = window._bugsnag.notifyReleaseStages;
}

// Allows old sprockets and inline-javascript to access webpack modules
window["Webpack"] = {
  modules: {
    "autosize": require("autosize"),
    "classnames": require("classnames"),
    "escape-html": require("escape-html"),
    "eventemitter3": require("eventemitter3"),
    "moment": require("moment"),
    "object-assign": require("object-assign"),
    "react": require("react"),
    "react-dom": require("react-dom"),
    "react-relay": require("react-relay"),
    "react-addons-pure-render-mixin": require("react-addons-pure-render-mixin"),

    "components/build/AvatarWithEmailPrompt": require("./components/build/AvatarWithEmailPrompt").default,
    "components/icons/BuildState": require("./components/icons/BuildState").default,
    "components/layout/Footer": require("./components/layout/Footer").default,
    "components/layout/Navigation": require("./components/layout/Navigation").default,
    "components/organization/AgentsCount": require("./components/organization/AgentsCount").default,
    "components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
    "components/pipeline/Teams": require("./components/pipeline/Teams").default,
    "components/PipelinesWelcome": require("./components/organization/Welcome").default,
    "components/shared/BuildStatusDescription": require("./components/shared/BuildStatusDescription").default,
    "components/shared/CollapsableFormField": require("./components/shared/CollapsableFormField").default,
    "components/shared/Duration": require("./components/shared/Duration").default,
    "components/shared/Emojify": require("./components/shared/Emojify").default,
    "components/shared/FormMarkdownEditorField": require("./components/shared/FormMarkdownEditorField").default,
    "components/shared/FormRadioGroup": require("./components/shared/FormRadioGroup").default,
    "components/shared/FormTextarea": require("./components/shared/FormTextarea").default,
    "components/shared/FormTextField": require("./components/shared/FormTextField").default,
    "components/shared/FriendlyTime": require("./components/shared/FriendlyTime").default,
    "components/shared/Icon": require("./components/shared/Icon").default,
    "components/user/BuildCountsBreakdown": require("./components/user/BuildCountsBreakdown").default,
    "components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
    "lib/builds": require("./lib/builds"),
    "lib/commits": require("./lib/commits"),
    "lib/date": require("./lib/date"),
    "lib/Emoji": require("./lib/Emoji").default,
    "lib/jobCommandOneliner": require("./lib/jobCommandOneliner").default,
    "lib/jobs": require("./lib/jobs"),
    "lib/Logger": require("./lib/Logger").default,
    "lib/number": require("./lib/number"),
    "lib/RelayPreloader": require("./lib/RelayPreloader").default,
    "queries/Agent": require("./queries/Agent"),
    "queries/Build": require("./queries/Build"),
    "queries/Organization": require("./queries/Organization"),
    "queries/Pipeline": require("./queries/Pipeline"),
    "queries/PipelineSchedule": require("./queries/PipelineSchedule"),
    "queries/Team": require("./queries/Team"),
    "queries/Viewer": require("./queries/Viewer"),
    "stores/FlashesStore": require("./stores/FlashesStore").default,
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
    new Relay.DefaultNetworkLayer(
      window._graphql["url"],
      { credentials: "same-origin", headers: window._graphql["headers"] }
    )
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
  require('react-type-snob').default(React);
  require('./lib/Logger').default.enable();
  require('react-relay/lib/RelayNetworkDebug').init();
  window.Perf = require('react-addons-perf');
}

// Only do the react-router gear on pages we've designated
window["initializeReactRouter"] = () => {
  ReactDOM.render(Routes, document.getElementById('root'));
};
