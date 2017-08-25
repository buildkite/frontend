import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay/classic';

import Routes from './routes';

import EmojiStyleManager from './lib/EmojiStyleManager';

// Detect and adjust for custom emoji scaling
EmojiStyleManager.apply();

require("./css/main.css");

// Setup Bugsnag for JS error tracking
if (window.Bugsnag && window._bugsnag) {
  window.Bugsnag.apiKey = window._bugsnag.apiKey;
  window.Bugsnag.appVersion = window._bugsnag.appVersion;
  window.Bugsnag.user = window._bugsnag.user;
  window.Bugsnag.releaseStage = window._bugsnag.releaseStage;
}

// Toggle on development features
if (process.env.NODE_ENV === "development") {
  require('react-type-snob').default(React);
  require('./lib/Logger').default.enable();
  require('react-relay/lib/RelayNetworkDebug').init();
  window.Perf = require('react-addons-perf');
}

// Allows old sprockets and inline-javascript to access webpack modules
window["Webpack"] = {
  modules: {
    "autosize": require("autosize"),
    "classnames": require("classnames"),
    "create-react-class": require("create-react-class"),
    "credit-card-type": require("credit-card-type"),
    "escape-html": require("escape-html"),
    "eventemitter3": require("eventemitter3"),
    "moment": require("moment"),
    "object-assign": require("object-assign"),
    "prop-types": require("prop-types"),
    "react": require("react"),
    "react-dom": require("react-dom"),
    "react-relay": require("react-relay/classic"),
    "react-addons-pure-render-mixin": require("react-addons-pure-render-mixin"),

    "components/billing/BillingHeader": require("./components/billing/BillingHeader").default,
    "components/build/AvatarWithUnknownEmailPrompt": require("./components/build/AvatarWithUnknownEmailPrompt").default,
    "components/build/StateSwitcher": require("./components/build/StateSwitcher").default,
    "components/build/AnnotationsList": require("./components/build/AnnotationsList").default,
    "components/build/Header/pipeline": require("./components/build/Header/pipeline").default,
    "components/icons/BuildState": require("./components/icons/BuildState").default,
    "components/layout/Footer": require("./components/layout/Footer").default,
    "components/layout/Navigation": require("./components/layout/Navigation").default,
    "components/layout/Flashes": require("./components/layout/Flashes").default,
    "components/organization/AgentsCount": require("./components/organization/AgentsCount").default,
    "components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
    "components/pipeline/Header": require("./components/pipeline/Header").default,
    "components/pipeline/Teams": require("./components/pipeline/Teams").default,
    "components/pipeline/SettingsMenu": require("./components/pipeline/SettingsMenu").default,
    "components/PipelinesWelcome": require("./components/organization/Welcome").default,
    "components/shared/BuildStatusDescription": require("./components/shared/BuildStatusDescription").default,
    "components/shared/Button": require("./components/shared/Button").default,
    "components/shared/CollapsableFormField": require("./components/shared/CollapsableFormField").default,
    "components/shared/Duration": require("./components/shared/Duration").default,
    "components/shared/Emojify": require("./components/shared/Emojify").default,
    "components/shared/FormMarkdownEditorField": require("./components/shared/FormMarkdownEditorField").default,
    "components/shared/FormYAMLEditorField": require("./components/shared/FormYAMLEditorField").default,
    "components/shared/FormRadioGroup": require("./components/shared/FormRadioGroup").default,
    "components/shared/FormTextarea": require("./components/shared/FormTextarea").default,
    "components/shared/FormTextField": require("./components/shared/FormTextField").default,
    "components/shared/FriendlyTime": require("./components/shared/FriendlyTime").default,
    "components/shared/Icon": require("./components/shared/Icon").default,
    "components/shared/UserAvatar": require("./components/shared/UserAvatar").default,
    "components/user/BuildCountsBreakdown": require("./components/user/BuildCountsBreakdown").default,
    "components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
    "lib/builds": require("./lib/builds"),
    "lib/commits": require("./lib/commits"),
    "lib/date": require("./lib/date"),
    "lib/jobCommandOneliner": require("./lib/jobCommandOneliner").default,
    "lib/jobs": require("./lib/jobs"),
    "lib/Logger": require("./lib/Logger").default,
    "lib/number": require("./lib/number"),
    "lib/parseEmoji": require("./lib/parseEmoji").default,
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
    }

    throw "No webpack module exported `" + module + "`";
  }
};

// Configure relay if we have access to the GraphQL URL
if (window._graphql) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(
      window._graphql["url"],
      {
        credentials: "same-origin",
        headers: window._graphql["headers"],
        // Standard relay values, that can be overriden by some pages. If a
        // request is taking a while, we don't want to force Relay to make
        // another because that's just gonna slow down the server even more. So
        // we'll bump the default fetchTimeout to 10m
        fetchTimeout: 600000, // 10m
        retryDelays: window._graphql["retryDelays"] || [1000, 3000]
      }
    )
  );
}

// Setup the PusherStore
if (window._pusher) {
  const pusherStore = require("./stores/PusherStore").default;
  pusherStore.configure(window._pusher["key"], window._pusher["options"]);
  for (const channel of window._pusher["channels"]) {
    pusherStore.listen(channel);
  }
}

// Also subscribe slanger if we've been asked
if (window._slanger) {
  const slangerStore = require("./stores/PusherStore").slanger;
  slangerStore.configure(window._slanger["key"], window._slanger["options"]);
  for (const channel of window._slanger["channels"]) {
    slangerStore.listen(channel);
  }
}

// Only do the react-router gear on pages we've designated
window["initializeReactRouter"] = () => {
  ReactDOM.render(Routes, document.getElementById('root'));
};
