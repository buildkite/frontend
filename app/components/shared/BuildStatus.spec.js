/* global describe, it, expect */
import moment from 'moment';
import MockDate from 'mockdate';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

describe('BuildStatus', () => {
  it(`calls through to \`friendlyRelativeTime\` and \`buildStatus\``, () => {
    MockDate.set(moment.parseZone("2016-10-09T24:21:50+1100"));

    const BUILD_STATUS_FIXTURE = {
      prefix: 'tested',
      timeValue: new Date(1475643467000)
    };

    const fauxFriendlyRelativeTime = jest.fn(() => 'at some point');
    const fauxBuildStatus = jest.fn(() => BUILD_STATUS_FIXTURE);

    jest.mock('../../lib/friendlyRelativeTime', () => fauxFriendlyRelativeTime);
    jest.mock('../../lib/builds', () => ({ buildStatus: fauxBuildStatus }));

    const BuildStatus = require('./BuildStatus').default;

    const build = {
      state: 'testing',
      canceledAt: new Date(1475643467000),
      createdAt: new Date(1475643466920),
      finishedAt: new Date(1475643467000)
    };

    const component = ReactTestRenderer.create(
      <BuildStatus build={build} updateFrequency={0} />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(fauxFriendlyRelativeTime).toHaveBeenCalledTimes(2);
    expect(fauxFriendlyRelativeTime).toHaveBeenCalledWith(BUILD_STATUS_FIXTURE.timeValue);
    expect(fauxBuildStatus).toHaveBeenCalledTimes(1);
    expect(fauxBuildStatus).toHaveBeenCalledWith(build);
    MockDate.reset();
  });
});
