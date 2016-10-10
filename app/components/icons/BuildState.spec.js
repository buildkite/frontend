/* global describe, it, expect, jest */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const SIZES = [
  'regular',
  'small'
];

const BUILD_STATES = [
  'pending',
  'scheduled',
  'running',
  'passed',
  'blocked',
  'failed',
  'canceled'
];

describe('BuildState', () => {
  jest.mock('uuid', () => ({ v4: () => 'NORMALLY-UUID-GOES-HERE-BUTNEVERMIND' }));

  const BuildState = require('./BuildState').default;

  SIZES.forEach((size) => {
    describe(`where size="${size}"`, () => {
      BUILD_STATES.forEach((state) => {
        it(`renders correctly for build state \`${state}\``, () => {
          const component = ReactTestRenderer.create(
            <BuildState state={state} size={size} />
          );

          const tree = component.toJSON();
          expect(tree).toMatchSnapshot();
        });
      });
    });
  });

  it(`passes through className`, () => {
    const component = ReactTestRenderer.create(
      <BuildState state={BUILD_STATES[0]} size={SIZES[0]} className="some-weird-class-name" />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it(`has default for \`size\``, () => {
    const component = ReactTestRenderer.create(
      <BuildState state={BUILD_STATES[0]} />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
