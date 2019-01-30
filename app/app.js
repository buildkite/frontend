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
window["require"] = function(module) {
  const exported = window["require"].modules[module];

  if (exported) {
    return exported;
  }

  throw "No webpack module exported `" + module + "`";
};

window["require"].modules = {
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
  "@rails/ujs": require("@rails/ujs"),

  "app/components/AnonymousNavigation": require("./components/AnonymousNavigation").default,
  "app/components/billing/BillingHeader": require("./components/billing/BillingHeader").default,
  "app/components/build/AnnotationsList": require("./components/build/AnnotationsList").default,
  "app/components/build/AvatarWithUnknownEmailPrompt": require("./components/build/AvatarWithUnknownEmailPrompt").default,
  "app/components/build/Header": require("./components/build/Header").default,
  "app/components/build/Show": require("./components/build/Show").default,
  "app/components/build/StateSwitcher": require("./components/build/StateSwitcher").default,
  "app/components/icons/BuildState": require("./components/icons/BuildState").default,
  "app/components/layout/Footer": require("./components/layout/Footer").default,
  "app/components/layout/Navigation": require("./components/layout/Navigation").default,
  "app/components/layout/Flashes": require("./components/layout/Flashes").default,
  "app/components/organization/SettingsMenu": require("./components/organization/SettingsMenu").default,
  "app/components/pipeline/Header": require("./components/pipeline/Header").default,
  "app/components/pipeline/Teams": require("./components/pipeline/Teams").default,
  "app/components/pipeline/SettingsMenu": require("./components/pipeline/SettingsMenu").default,
  "app/components/shared/BetaBadge": require("./components/shared/BetaBadge").default,
  "app/components/shared/BuildStatusDescription": require("./components/shared/BuildStatusDescription").default,
  "app/components/shared/Button": require("./components/shared/Button").default,
  "app/components/shared/CollapsableFormField": require("./components/shared/CollapsableFormField").default,
  "app/components/shared/Duration": require("./components/shared/Duration").default,
  "app/components/shared/Dialog": require("./components/shared/Dialog").default,
  "app/components/shared/Emojify": require("./components/shared/Emojify").default,
  "app/components/shared/FormMarkdownEditorField": require("./components/shared/FormMarkdownEditorField").default,
  "app/components/shared/FormYAMLEditorField": require("./components/shared/FormYAMLEditorField").default,
  "app/components/shared/FormRadioGroup": require("./components/shared/FormRadioGroup").default,
  "app/components/shared/FormTextarea": require("./components/shared/FormTextarea").default,
  "app/components/shared/FormTextField": require("./components/shared/FormTextField").default,
  "app/components/shared/FriendlyTime": require("./components/shared/FriendlyTime").default,
  "app/components/shared/Icon": require("./components/shared/Icon").default,
  "app/components/shared/ImageUploadField": require("./components/shared/ImageUploadField").default,
  "app/components/shared/UserAvatar": require("./components/shared/UserAvatar").default,
  "app/components/user/BuildCountsBreakdown": require("./components/user/BuildCountsBreakdown").default,
  "app/components/user/SettingsMenu": require("./components/user/SettingsMenu").default,
  "app/components/user/graphql/schema": require("./components/user/graphql/schema"),
  "app/lib/AssetUploader": require("./lib/AssetUploader").default,
  "app/lib/Bugsnag": require("./lib/Bugsnag"),
  "app/lib/builds": require("./lib/builds"),
  "app/lib/commits": require("./lib/commits"),
  "app/lib/date": require("./lib/date"),
  "app/lib/jobCommandOneliner": require("./lib/jobCommandOneliner").default,
  "app/lib/jobs": require("./lib/jobs"),
  "app/lib/Logger": require("./lib/Logger").default,
  "app/lib/number": require("./lib/number"),
  "app/lib/parseEmoji": require("./lib/parseEmoji").default,
  "app/lib/reactRenderer": require("./lib/reactRenderer").default,
  "app/lib/RelayPreloader": require("./lib/RelayPreloader").default,
  "app/lib/RelayModernPreloader": require("./lib/RelayModernPreloader").default,
  "app/lib/BootstrapTooltipMixin": require('./lib/BootstrapTooltipMixin').default,
  "app/queries/Agent": require("./queries/Agent"),
  "app/queries/Build": require("./queries/Build"),
  "app/queries/Organization": require("./queries/Organization"),
  "app/queries/Pipeline": require("./queries/Pipeline"),
  "app/queries/PipelineSchedule": require("./queries/PipelineSchedule"),
  "app/queries/Team": require("./queries/Team"),
  "app/queries/Viewer": require("./queries/Viewer"),
  "app/stores/FlashesStore": require("./stores/FlashesStore").default,
  "app/stores/CentrifugeStore": require("./stores/CentrifugeStore").default,
  "app/stores/PusherStore": require("./stores/PusherStore").default
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

// Setup the PusherStore, if configured
if (window._pusher) {
  const pusherStore = require("./stores/PusherStore").default;
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
