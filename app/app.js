// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import reactRender from 'app/lib/reactRenderer';
import Routes from 'app/routes';
import EmojiStyleManager from 'app/lib/EmojiStyleManager';

// Detect and adjust for custom emoji scaling
EmojiStyleManager.apply();

require("app/css/main.css");

// Toggle on development features
if (process.env.NODE_ENV === "development") {
  require('react-type-snob').default(React);
  require('app/lib/Logger').default.enable();
  require('react-relay/lib/RelayNetworkDebug').init();
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

    "components/billing/BillingHeader": require("app/components/billing/BillingHeader").default,
    "components/build/AnnotationsList": require("app/components/build/AnnotationsList").default,
    "components/build/AvatarWithUnknownEmailPrompt": require("app/components/build/AvatarWithUnknownEmailPrompt").default,
    "components/build/Header": require("app/components/build/Header").default,
    "components/build/Show": require("app/components/build/Show").default,
    "components/build/StateSwitcher": require("app/components/build/StateSwitcher").default,
    "components/icons/BuildState": require("app/components/icons/BuildState").default,
    "components/layout/Footer": require("app/components/layout/Footer").default,
    "components/layout/Navigation": require("app/components/layout/Navigation").default,
    "components/layout/Flashes": require("app/components/layout/Flashes").default,
    "components/organization/AgentsCount": require("app/components/organization/AgentsCount").default,
    "components/organization/SettingsMenu": require("app/components/organization/SettingsMenu").default,
    "components/pipeline/Header": require("app/components/pipeline/Header").default,
    "components/pipeline/Teams": require("app/components/pipeline/Teams").default,
    "components/pipeline/SettingsMenu": require("app/components/pipeline/SettingsMenu").default,
    "components/PipelinesWelcome": require("app/components/organization/Welcome").default,
    "components/shared/BuildStatusDescription": require("app/components/shared/BuildStatusDescription").default,
    "components/shared/Button": require("app/components/shared/Button").default,
    "components/shared/CollapsableFormField": require("app/components/shared/CollapsableFormField").default,
    "components/shared/Duration": require("app/components/shared/Duration").default,
    "components/shared/Emojify": require("app/components/shared/Emojify").default,
    "components/shared/FormMarkdownEditorField": require("app/components/shared/FormMarkdownEditorField").default,
    "components/shared/FormYAMLEditorField": require("app/components/shared/FormYAMLEditorField").default,
    "components/shared/FormRadioGroup": require("app/components/shared/FormRadioGroup").default,
    "components/shared/FormTextarea": require("app/components/shared/FormTextarea").default,
    "components/shared/FormTextField": require("app/components/shared/FormTextField").default,
    "components/shared/FriendlyTime": require("app/components/shared/FriendlyTime").default,
    "components/shared/Icon": require("app/components/shared/Icon").default,
    "components/shared/UserAvatar": require("app/components/shared/UserAvatar").default,
    "components/user/BuildCountsBreakdown": require("app/components/user/BuildCountsBreakdown").default,
    "components/user/SettingsMenu": require("app/components/user/SettingsMenu").default,
    "components/user/graphql/schema": require("app/components/user/graphql/schema"),
    "lib/AssetUploader": require("app/lib/AssetUploader").default,
    "lib/Bugsnag": require("app/lib/Bugsnag"),
    "lib/builds": require("app/lib/builds"),
    "lib/commits": require("app/lib/commits"),
    "lib/date": require("app/lib/date"),
    "lib/jobCommandOneliner": require("app/lib/jobCommandOneliner").default,
    "lib/jobs": require("app/lib/jobs"),
    "lib/Logger": require("app/lib/Logger").default,
    "lib/number": require("app/lib/number"),
    "lib/parseEmoji": require("app/lib/parseEmoji").default,
    "lib/reactRenderer": require("app/lib/reactRenderer").default,
    "lib/RelayPreloader": require("app/lib/RelayPreloader").default,
    "lib/BootstrapTooltipMixin": require('app/lib/BootstrapTooltipMixin').default,
    "queries/Agent": require("app/queries/Agent"),
    "queries/Build": require("app/queries/Build"),
    "queries/Organization": require("app/queries/Organization"),
    "queries/Pipeline": require("app/queries/Pipeline"),
    "queries/PipelineSchedule": require("app/queries/PipelineSchedule"),
    "queries/Team": require("app/queries/Team"),
    "queries/Viewer": require("app/queries/Viewer"),
    "stores/FlashesStore": require("app/stores/FlashesStore").default,
    "stores/PusherStore": require("app/stores/PusherStore").default
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
  const pusherStore = require("app/stores/PusherStore").default;
  pusherStore.configure(window._pusher["key"], window._pusher["options"]);
  for (const channel of window._pusher["channels"]) {
    pusherStore.listen(channel);
  }
}

// Only do the react-router gear on pages we've designated
window["initializeReactRouter"] = () => {
  const rootElement = document && document.getElementById("root");

  if (!rootElement) {
    throw new Error("No #root element to render the application to!");
  }

  reactRender(Routes, rootElement);
};
