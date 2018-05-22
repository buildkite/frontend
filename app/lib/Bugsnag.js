// @flow

import React from 'react';
import Bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';

const bugsnag = Bugsnag(window._bugsnag);

export default bugsnag;

export const ErrorBoundary = bugsnag.use(createPlugin(React));
