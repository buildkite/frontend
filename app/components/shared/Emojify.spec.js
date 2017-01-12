/* global describe, it, jest, expect */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const FIXTURE_TEXT = "This text should be reflected in the title attribute and text content, as well as in the call to lib/Emoji!";

describe('Emojify', () => {
  it('renders as expected', () => {
    const mockParse = jest.fn((text) => text);

    jest.mock('../../lib/Emoji', () => ({ parse: mockParse }));

    const { default: Emojify } = require('./Emojify');

    const component = ReactTestRenderer.create(
      <Emojify
        text="This text should be reflected in the title attribute and text content, as well as in the call to lib/Emoji!"
        className="test-class-name"
        updateFrequency={0}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(mockParse).toHaveBeenCalledWith(FIXTURE_TEXT);
  });
});
