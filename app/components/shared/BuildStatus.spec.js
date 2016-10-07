/* global describe, it, expect */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import BuildStatus from './BuildStatus';

const BUILD_STATES = [
  'started',
  'failed',
  'passed',
  'blocked',
  'canceled',
  'canceling',
  'scheduled',
  'skipped',
  'not_run'
];

describe('BuildStatus', () => {
  BUILD_STATES.forEach((state) => {
    it(`shows correct build status for the \`${state}\` state`, () => {
      const build = {
        state,
        canceledAt: new Date(1475643467000),
        createdAt: new Date(1475643466920),
        finishedAt: new Date(1475643467000)
      };

      const component = ReactTestRenderer.create(
        <BuildStatus build={build} updateFrequency={0} />
      );

      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
