/* global describe, it, expect, jest */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BuildState from './BuildState';

jest.mock('uuid', () => ({ v4: () => 'NORMALLY-UUID-GOES-HERE-BUTNEVERMIND' }));

const BUILD_STATES = [
  null,
  'SCHEDULED',
  'RUNNING',
  'PASSED',
  'BLOCKED',
  'FAILED',
  'CANCELED',
  'SKIPPED',
  'NOT_RUN'
];

describe('BuildState', () => {
  const componentList = Object.keys(BuildState);

  it('stateless Components are accessible', () => {
    expect(componentList).toMatchSnapshot();
  });

  componentList.forEach((componentName) => {
    const BuildStateComponent = BuildState[componentName];

    describe(`BuildState.${componentName}`, () => {
      BUILD_STATES.forEach((state) => {
        it(`renders correctly for build state \`${state}\``, () => {
          const component = ReactTestRenderer.create(
            <BuildStateComponent state={state} />
          );

          const tree = component.toJSON();
          expect(tree).toMatchSnapshot();
        });
      });
    });
  });

  it(`passes through className`, () => {
    const FirstBuildState = BuildState[componentList[0]];
    const component = ReactTestRenderer.create(
      <FirstBuildState state={BUILD_STATES[0]} className="some-weird-class-name" />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
