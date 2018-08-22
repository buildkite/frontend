/* global jest, describe, it, expect, xdescribe */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import Duration from './Duration';

jest.mock('../../lib/date', () => {
  const getDurationString = jest.fn(() => 'MOCKED-DURATION');
  getDurationString.formats = ['expected'];
  const getDuration = jest.fn(() => 42069);
  return { getDuration, getDurationString };
});

describe('Duration', () => {
  const componentList = Object.keys(Duration);
  const DurationComponent = Duration.Expected;

  it('provides stateless Components named after `getDurationString.formats`', () => {
    expect(componentList).toEqual(['Expected']);
  });

  it('calls through to `getDurationString`', () => {
    const getDuration = require('../../lib/date').getDuration;
    const getDurationString = require('../../lib/date').getDurationString;
    const from = new Date();
    const to = new Date();

    const component = ReactTestRenderer.create(
      <DurationComponent
        from={from}
        to={to}
        updateFrequency={0}
      />
    );

    const tree = component.toJSON();
    expect(getDuration).toHaveBeenCalledWith(from, to);
    expect(getDurationString).toHaveBeenCalledWith(42069, 'expected');
    expect(tree).toMatchSnapshot();
  });

  describe('tabularNumerals', () => {
    it('can be disabled', () => {
      const getDuration = require('../../lib/date').getDuration;
      const getDurationString = require('../../lib/date').getDurationString;
      const from = new Date();
      const to = new Date();

      const component = ReactTestRenderer.create(
        <DurationComponent
          tabularNumerals={false}
          from={from}
          to={to}
          updateFrequency={0}
        />
      );

      const tree = component.toJSON();
      expect(getDuration).toHaveBeenCalledWith(from, to);
      expect(getDurationString).toHaveBeenCalledWith(42069, 'expected');
      expect(tree).toMatchSnapshot();
    });
  });

  xdescribe('updateFrequency', () => {
    // TODO: Need to be able to instrument updating and interactions
    it('sets an interval if supplied with a frequency greater than zero', () => {
      const rendered = ReactTestRenderer.create(
        <DurationComponent
          from="2016-05-07T09:00:00.000Z"
          to="2016-05-07T09:00:00.000Z"
          updateFrequency={10}
        />
      );

      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('sets no interval if supplied with a frequency of zero', () => {
      const rendered = ReactTestRenderer.create(
        <DurationComponent
          from="2016-05-07T09:00:00.000Z"
          to="2016-05-07T09:00:00.000Z"
          updateFrequency={0}
        />
      );

      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });
});
