// @flow
/* eslint-disable react/no-render-return-value */

import * as React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './Bugsnag';

export default function reactRenderer<ElementType: React$ElementType>(
  element: React$Element<ElementType>,
  container: Element,
  callback?: () => void
) {
  return ReactDOM.render(
    <ErrorBoundary>{element}</ErrorBoundary>,
    container,
    callback
  );
}
