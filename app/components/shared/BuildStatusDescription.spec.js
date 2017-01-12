/* global describe, it, expect, jest */
import moment from 'moment';
import MockDate from 'mockdate';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

describe('BuildStatusDescription', () => {
  it(`calls through to \`getRelativeDateString\` and \`buildStatus\``, () => {
    MockDate.set(moment.parseZone("2016-10-10T00:21:50+1100"));

    const BUILD_STATUS_FIXTURE = {
      prefix: 'tested',
      timeValue: moment.parseZone("2016-10-09T23:58:05+1100")
    };

    const mockGetDateString = jest.fn(() => 'at an absolute point');
    const mockGetRelativeDateString = jest.fn(() => 'at some point');
    const mockBuildStatusDescription = jest.fn(() => BUILD_STATUS_FIXTURE);

    jest.mock('../../lib/date', () => ({ getDateString: mockGetDateString, getRelativeDateString: mockGetRelativeDateString }));
    jest.mock('../../lib/builds', () => ({ buildStatus: mockBuildStatusDescription }));

    const BuildStatusDescription = require('./BuildStatusDescription').default;

    const build = {
      state: 'testing',
      canceledAt: new Date(1475643467000),
      createdAt: new Date(1475643466920),
      finishedAt: new Date(1475643467000)
    };

    const component = ReactTestRenderer.create(
      <BuildStatusDescription build={build} updateFrequency={0} />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(mockGetDateString).toHaveBeenCalledTimes(1);
    expect(mockGetDateString).toHaveBeenCalledWith(BUILD_STATUS_FIXTURE.timeValue);
    expect(mockGetRelativeDateString).toHaveBeenCalledTimes(2);
    expect(mockGetRelativeDateString).toHaveBeenCalledWith(BUILD_STATUS_FIXTURE.timeValue);
    expect(mockBuildStatusDescription).toHaveBeenCalledTimes(1);
    expect(mockBuildStatusDescription).toHaveBeenCalledWith(build);
    MockDate.reset();
  });
});
