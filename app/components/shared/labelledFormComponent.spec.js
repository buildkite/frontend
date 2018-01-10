/* global describe, it, expect */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import labelled from './labelledFormComponent';

describe('labelledFormComponent', () => {
  it('renders DOM element children as expected', () => {
    const LabelledFormComponent = labelled('input');

    const component = TestUtils.renderIntoDocument(
      <LabelledFormComponent label="Test Input Field" />
    );

    const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node
    expect(node).toMatchSnapshot();
  });

  it('exposes a `focus` function', () => {
    const LabelledFormComponent = labelled('input');

    const component = TestUtils.renderIntoDocument(
      <LabelledFormComponent label="Test Input Field" />
    );

    expect(Object.getOwnPropertyDescriptor(LabelledFormComponent.prototype, 'focus')).toMatchSnapshot();
    expect(() => component.focus()).not.toThrow();
  });

  it('exposes a `value` getter', () => {
    const LabelledFormComponent = labelled('input');

    const component = TestUtils.renderIntoDocument(
      <LabelledFormComponent label="Test Input Field" defaultValue="meow" />
    );

    expect(Object.getOwnPropertyDescriptor(LabelledFormComponent.prototype, 'value')).toMatchSnapshot();
    expect(component.value).toBe("meow");
  });

  it('exposes specified proxy methods', () => {
    const LabelledFormComponent = labelled('input');

    LabelledFormComponent.proxyMethods = ['select'];

    const component = TestUtils.renderIntoDocument(
      <LabelledFormComponent label="Test Input Field" />
    );

    expect(component.select).toBeInstanceOf(Function);
    expect(Object.getOwnPropertyDescriptor(component, 'select')).toMatchSnapshot();
    expect(() => component.select()).not.toThrow();
  });
});
