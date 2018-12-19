// @flow

import './public-path';

import React from 'react';
import Relay from 'react-relay/classic';
import reactRender from './lib/reactRenderer';
import Routes from './routes';
import EmojiStyleManager from './lib/EmojiStyleManager';
import Environment from 'app/lib/relay/environment';

// Create the a Relay Modern environment
Environment.create();

// Detect and adjust for custom emoji scaling
EmojiStyleManager.apply();

require("./css/main.css");

// Toggle on development features
if (process.env.NODE_ENV === "development") {
  require('react-type-snob').default(React);
  require('./lib/Logger').default.enable();
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

    "components/billing/BillingHeader": require("./components/billing/BillingHeader").default,
    "components/build/AnnotationsList": require("./components/build/AnnotationsList").default,
    "components/build/AvatarWithUnknownEmailPrompt": require("./components/build/AvatarWithUnknownEmailPrompt").default,
    "components/build/Header": require("./components/build/Header").default,
    "components/build/Show": require("./components/build/Show").default,
    "components/build/StateSwitcher": require("./components/build/StateSwitcher").default,
    "components/icons/BuildState": require("./components/icons/BuildState").default,
    "components/layout/Footer": require("./components/layout/Footer").default,
    "components/layout/Navigation": require("./components/layout/Navigation").default,
    "components/layout/Flashes": require("./components/layout/Flashes").default,
    "components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
    "components/pipeline/Header": require("./components/pipeline/Header").default,
    "components/pipeline/Teams": require("./components/pipeline/Teams").default,
    "components/pipeline/SettingsMenu": require("./components/pipeline/SettingsMenu").default,
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
    "components/shared/ImageUploadField": require("./components/shared/ImageUploadField").default,
    "components/shared/UserAvatar": require("./components/shared/UserAvatar").default,
    "components/user/BuildCountsBreakdown": require("./components/user/BuildCountsBreakdown").default,
    "components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
    "components/user/graphql/schema": require("./components/user/graphql/schema"),
    "lib/AssetUploader": require("./lib/AssetUploader").default,
    "lib/Bugsnag": require("./lib/Bugsnag"),
    "lib/builds": require("./lib/builds"),
    "lib/commits": require("./lib/commits"),
    "lib/date": require("./lib/date"),
    "lib/jobCommandOneliner": require("./lib/jobCommandOneliner").default,
    "lib/jobs": require("./lib/jobs"),
    "lib/Logger": require("./lib/Logger").default,
    "lib/number": require("./lib/number"),
    "lib/parseEmoji": require("./lib/parseEmoji").default,
    "lib/reactRenderer": require("./lib/reactRenderer").default,
    "lib/RelayPreloader": require("./lib/RelayPreloader").default,
    "lib/RelayModernPreloader": require("./lib/RelayModernPreloader").default,
    "lib/BootstrapTooltipMixin": require('./lib/BootstrapTooltipMixin').default,
    "queries/Agent": require("./queries/Agent"),
    "queries/Build": require("./queries/Build"),
    "queries/Organization": require("./queries/Organization"),
    "queries/Pipeline": require("./queries/Pipeline"),
    "queries/PipelineSchedule": require("./queries/PipelineSchedule"),
    "queries/Team": require("./queries/Team"),
    "queries/Viewer": require("./queries/Viewer"),
    "stores/FlashesStore": require("./stores/FlashesStore").default,
    "stores/CentrifugeStore": require("./stores/CentrifugeStore").default,
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

// Setup the CentrifugeStore, if configured
if (window._centrifuge) {
  const centrifugeStore = require("./stores/CentrifugeStore").default;
  centrifugeStore.configure(window._centrifuge["url"], window._centrifuge["token"], window._centrifuge["options"]);
  for (const channel of window._centrifuge["channels"]) {
    centrifugeStore.listen(channel);
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
