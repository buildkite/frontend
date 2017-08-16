/* global describe, beforeEach, jest, it, expect */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import { types as CardType } from 'credit-card-type';

import CreditCardInput from './CreditCardInput';

// Render CreditCardInput into the document with supplied props
const renderWithProps = (props = {}) => (
  TestUtils.renderIntoDocument(
    <CreditCardInput {...props} />
  )
);

// Return the value and current selection of the element
const valueAndSelectionOf = (element) => {
  const { value, selectionStart, selectionEnd } = element;
  return { value, selectionStart, selectionEnd };
};

const AMEX_TEST_UNFORMATTED = '3777 2222 6666 999';
const AMEX_TEST_FORMATTED = '3777 222266 66999';

const MASTERCARD_TEST_UNFORMATTED = '2227772727272727';
const MASTERCARD_TEST_FORMATTED = '2227 7727 2727 2727';

const VISA_LONG_TEST_UNFORMATTED = '4434 43443 44444 34434';
const VISA_LONG_TEST_FORMATTED = '4434 4344 3444 4434434';

describe('<CreditCardInput />', () => {
  let fakeOnChange;
  let fakePreventDefault;

  beforeEach(() => {
    fakeOnChange = jest.fn();
    fakePreventDefault = jest.fn();
  });

  it('renders as expected with no arguments', () => {
    const component = renderWithProps();
    const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

    expect(node).toMatchSnapshot();
  });

  it('correctly accepts a `defaultValue` prop', () => {
    const component = renderWithProps({
      defaultValue: AMEX_TEST_FORMATTED
    });
    const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

    expect(node).toMatchSnapshot();
  });

  describe('key input', () => {
    it('handles typing as expected', () => {
      const component = renderWithProps({
        onChange: fakeOnChange
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(valueAndSelectionOf(input)).toMatchSnapshot();

      AMEX_TEST_UNFORMATTED.split('').forEach((char) => {
        input.value += char;
        input.selectionStart = input.selectionEnd = input.value.length;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();
        expect(valueAndSelectionOf(input)).toMatchSnapshot();
      });

      expect(fakeOnChange).toHaveBeenCalledTimes(AMEX_TEST_UNFORMATTED.length);
      expect(fakeOnChange).toHaveBeenCalledWith(AMEX_TEST_FORMATTED, CardType.AMERICAN_EXPRESS);
      expect(node).toMatchSnapshot();
    });

    it('handles typing at the start of a value as expected', () => {
      const component = renderWithProps({
        onChange: fakeOnChange
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(valueAndSelectionOf(input)).toMatchSnapshot();

      AMEX_TEST_UNFORMATTED.split('').reverse().forEach((char) => {
        input.value = char + input.value;
        input.selectionStart = input.selectionEnd = 0;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();
        expect(valueAndSelectionOf(input)).toMatchSnapshot();
      });

      expect(fakeOnChange).toHaveBeenCalledTimes(AMEX_TEST_UNFORMATTED.length);
      expect(fakeOnChange).toHaveBeenCalledWith(AMEX_TEST_FORMATTED, CardType.AMERICAN_EXPRESS);
      expect(node).toMatchSnapshot();
    });

    it('handles empty values', () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        defaultValue: '1'
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
      input.selectionStart = input.selectionEnd = 1;
      component.handleSelectionChange();

      expect(valueAndSelectionOf(input)).toMatchSnapshot();

      input.value = '';
      input.selectionStart = input.selectionEnd = 0;
      TestUtils.Simulate.change(input);
      component.handleSelectionChange();

      expect(valueAndSelectionOf(input)).toMatchSnapshot();

      expect(fakeOnChange).toHaveBeenCalledTimes(1);
      expect(fakeOnChange).toHaveBeenCalledWith('', null);
      expect(node).toMatchSnapshot();
    });

    it('unformats unknown cards', () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        acceptedTypes: [CardType.AMERICAN_EXPRESS]
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(valueAndSelectionOf(input)).toMatchSnapshot();

      MASTERCARD_TEST_UNFORMATTED.split('').forEach((char) => {
        input.value += char;
        input.selectionStart = input.selectionEnd = input.value.length;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();
        expect(valueAndSelectionOf(input)).toMatchSnapshot();
      });

      expect(fakeOnChange).toHaveBeenCalledTimes(MASTERCARD_TEST_UNFORMATTED.length);
      expect(fakeOnChange).toHaveBeenCalledWith(MASTERCARD_TEST_UNFORMATTED, null);
      expect(node).toMatchSnapshot();
    });

    describe('backspacing', () => {
      it('character after whitespace deletes the whitespace', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 2'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = input.value.length;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = input.value.slice(0, -1);
        input.selectionStart = input.selectionEnd = input.value.length;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3777', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });

      it('whitespace deletes the character before', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 2'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = input.value.length - 1;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = '37772';
        input.selectionStart = input.selectionEnd = input.value.length - 1;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3772', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });

      it('character before whitespace preserves whitespace location', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 2'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = input.value.length - 2;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = '377 2';
        input.selectionStart = input.selectionEnd = input.value.length - 2;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3772', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });
    });

    describe('deleting', () => {
      it('character after whitespace preserves whitespace location', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 2'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = input.value.length - 1;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = input.value.slice(0, -1);
        TestUtils.Simulate.change(input);

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3777', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });

      it('whitespace deletes the character after', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 23'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = 4;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = '377723';
        input.selectionStart = input.selectionEnd = 4;
        TestUtils.Simulate.change(input);

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3777 3', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });

      it('character before whitespace deletes the whitespace', () => {
        const component = renderWithProps({
          onChange: fakeOnChange,
          defaultValue: '3777 2'
        });
        const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

        expect(node).toMatchSnapshot();

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        input.selectionStart = input.selectionEnd = input.value.length - 3;
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        input.value = '377 2';
        input.selectionStart = input.selectionEnd = input.value.length - 3;
        TestUtils.Simulate.change(input);
        component.handleSelectionChange();

        expect(valueAndSelectionOf(input)).toMatchSnapshot();

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
        expect(fakeOnChange).toHaveBeenCalledWith('3772', CardType.AMERICAN_EXPRESS);
        expect(node).toMatchSnapshot();
      });
    });
  });

  describe('pasting', () => {
    it('handles inputs which are longer than current values', () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        defaultValue: MASTERCARD_TEST_FORMATTED
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      const getClipboardData = jest.fn(() => VISA_LONG_TEST_UNFORMATTED);
      input.selectionStart = input.selectionEnd = 0;
      component.handleSelectionChange();

      // NOTE: We have to pass this in directly as `document` is fake
      component.handlePaste({
        target: input,
        clipboardData: {
          getData: getClipboardData
        },
        preventDefault: fakePreventDefault
      });

      expect(getClipboardData).toHaveBeenCalledTimes(1);
      expect(getClipboardData).toHaveBeenCalledWith('text/plain');
      expect(fakeOnChange).toHaveBeenCalledTimes(1);
      expect(fakeOnChange).toHaveBeenCalledWith(VISA_LONG_TEST_FORMATTED, CardType.VISA);
      expect(fakePreventDefault).toHaveBeenCalledTimes(1);
      expect(node).toMatchSnapshot();
    });

    it('handles values being pased over an existing value', () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        defaultValue: AMEX_TEST_FORMATTED
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      const getClipboardData = jest.fn(() => VISA_LONG_TEST_UNFORMATTED);
      input.selectionStart = 0;
      input.selectionEnd = AMEX_TEST_FORMATTED.length;
      component.handleSelectionChange();

      // NOTE: We have to pass this in directly as `document` is fake
      component.handlePaste({
        target: input,
        clipboardData: {
          getData: getClipboardData
        },
        preventDefault: fakePreventDefault
      });

      expect(getClipboardData).toHaveBeenCalledTimes(1);
      expect(getClipboardData).toHaveBeenCalledWith('text/plain');
      expect(fakeOnChange).toHaveBeenCalledTimes(1);
      expect(fakeOnChange).toHaveBeenCalledWith(VISA_LONG_TEST_FORMATTED, CardType.VISA);
      expect(fakePreventDefault).toHaveBeenCalledTimes(1);
      expect(node).toMatchSnapshot();
    });

    it('handles values being pased into the middle of an existing value', () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        defaultValue: AMEX_TEST_FORMATTED
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      const getClipboardData = jest.fn(() => VISA_LONG_TEST_UNFORMATTED);
      input.selectionStart = 4;
      input.selectionEnd = 6;
      component.handleSelectionChange();

      // NOTE: We have to pass this in directly as `document` is fake
      component.handlePaste({
        target: input,
        clipboardData: {
          getData: getClipboardData
        },
        preventDefault: fakePreventDefault
      });

      expect(getClipboardData).toHaveBeenCalledTimes(1);
      expect(getClipboardData).toHaveBeenCalledWith('text/plain');
      expect(fakeOnChange).toHaveBeenCalledTimes(1);
      //                        AMEX Starts here ↓    ↓ Visa starts here
      expect(fakeOnChange).toHaveBeenCalledWith('3777 443443 44344', CardType.AMERICAN_EXPRESS);
      expect(fakePreventDefault).toHaveBeenCalledTimes(1);
      expect(node).toMatchSnapshot();
    });

    it("doesn't call preventDefault if the paste event doesn't provide data", () => {
      const component = renderWithProps({
        onChange: fakeOnChange,
        defaultValue: AMEX_TEST_FORMATTED
      });
      const node = ReactDOM.findDOMNode(component); // eslint-disable-line react/no-find-dom-node

      expect(node).toMatchSnapshot();

      const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      // NOTE: We have to pass this in directly as `document` is fake
      component.handlePaste({
        target: input,
        preventDefault: fakePreventDefault
      });

      expect(fakeOnChange).toHaveBeenCalledTimes(0);
      expect(fakePreventDefault).not.toHaveBeenCalled();
      expect(node).toMatchSnapshot();
    });
  });
});