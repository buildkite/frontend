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

    const fauxGetDateString = jest.fn(() => 'at an absolute point');
    const fauxGetRelativeDateString = jest.fn(() => 'at some point');
    const fauxBuildStatusDescription = jest.fn(() => BUILD_STATUS_FIXTURE);

    jest.mock('../../lib/date', () => ({ getDateString: fauxGetDateString, getRelativeDateString: fauxGetRelativeDateString }));
    jest.mock('../../lib/builds', () => ({ buildStatus: fauxBuildStatusDescription }));

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
    expect(fauxGetDateString).toHaveBeenCalledTimes(1);
    expect(fauxGetDateString).toHaveBeenCalledWith(BUILD_STATUS_FIXTURE.timeValue);
    expect(fauxGetRelativeDateString).toHaveBeenCalledTimes(2);
    expect(fauxGetRelativeDateString).toHaveBeenCalledWith(BUILD_STATUS_FIXTURE.timeValue);
    expect(fauxBuildStatusDescription).toHaveBeenCalledTimes(1);
    expect(fauxBuildStatusDescription).toHaveBeenCalledWith(build);
    MockDate.reset();
  });
});
