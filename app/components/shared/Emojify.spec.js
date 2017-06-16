/* global describe, it, jest, expect */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

describe('Emojify', () => {
  const mockParse = jest.fn((text) => text.replace(/:/g, ''));

  jest.mock('../../lib/parseEmoji', () => mockParse);

  const { default: Emojify } = require('./Emojify');

  it('renders `text` with emoji as expected', () => {
    const FIXTURE_TEXT = "This text has :sparkles:emoji:buildkite:, and should be reflected in the title attribute. The text content should contain different text, as processed by lib/parseEmoji!";

    const component = ReactTestRenderer.create(
      <Emojify
        text={FIXTURE_TEXT}
        className="test-class-name"
        updateFrequency={0}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(mockParse).toHaveBeenCalledWith(FIXTURE_TEXT);
  });

  it('renders plain `text` as expected', () => {
    const FIXTURE_TEXT = "This text should be reflected in the title attribute and text content, as well as in the call to lib/parseEmoji!";

    const component = ReactTestRenderer.create(
      <Emojify
        text={FIXTURE_TEXT}
        className="test-class-name"
        updateFrequency={0}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(mockParse).toHaveBeenCalledWith(FIXTURE_TEXT);
  });

  it('accepts a `title` override', () => {
    const component = ReactTestRenderer.create(
      <Emojify
        text="This is the text I want to display, it has bee..."
        title="This is the text I want to display, it has been truncated, so the title is used to show the rest on hover!"
        className="another-test-class-name"
        updateFrequency={0}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(mockParse).toHaveBeenCalledWith("This is the text I want to display, it has bee...");
  });
});
