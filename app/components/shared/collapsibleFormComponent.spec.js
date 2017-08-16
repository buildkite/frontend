/* global describe, it, jest, expect */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import collapsible from './collapsibleFormComponent';

describe('collapsibleFormComponent', () => {
  it('renders DOM element children as expected', () => {
    const CollapsibleFormComponent = collapsible('input');

    const component = TestUtils.renderIntoDocument(
      <CollapsibleFormComponent label="Test Input Field" />
    );

    const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node
    expect(node).toMatchSnapshot();
  });

  it('renders React component children as expected', () => {
    const CollapsibleFormComponent = collapsible((props) => <pre>{JSON.stringify(props)}</pre>);

    const component = TestUtils.renderIntoDocument(
      <CollapsibleFormComponent label="Test Input Field" this-should-be="passed through" />
    );

    const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node
    expect(node).toMatchSnapshot();
  });

  it('exposes a `focus` function', () => {
    const CollapsibleFormComponent = collapsible('input');

    const component = TestUtils.renderIntoDocument(
      <CollapsibleFormComponent label="Test Input Field" />
    );

    expect(Object.getOwnPropertyDescriptor(CollapsibleFormComponent.prototype, 'focus')).toMatchSnapshot();
    expect(() => component.focus()).not.toThrow();
  });

  it('exposes a `value` getter', () => {
    const CollapsibleFormComponent = collapsible('input');

    const component = TestUtils.renderIntoDocument(
      <CollapsibleFormComponent label="Test Input Field" defaultValue="meow" />
    );

    expect(Object.getOwnPropertyDescriptor(CollapsibleFormComponent.prototype, 'value')).toMatchSnapshot();
    expect(component.value).toBe("meow")
  });

  it('exposes specified proxy methods', () => {
    const CollapsibleFormComponent = collapsible('input');

    CollapsibleFormComponent.proxyMethods = ['select'];

    const component = TestUtils.renderIntoDocument(
      <CollapsibleFormComponent label="Test Input Field" />
    );

    expect(component.select).toBeInstanceOf(Function);
    expect(Object.getOwnPropertyDescriptor(component, 'select')).toMatchSnapshot();
    expect(() => component.select()).not.toThrow();
  });
});
