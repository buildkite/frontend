import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import creditCardType, { types as CardType } from 'credit-card-type';

import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

const FALLBACK_CARD_LENGTH = 20;
const CARD_GAP_STRING = ' ';

const cursorDebug = (string, selectionStart, selectionEnd) => {
  if (selectionStart === selectionEnd) {
    return `${string.substring(0, selectionStart)}|${string.substring(selectionStart)}`;
  } else if (selectionStart < selectionEnd) {
    return `${string.substring(0, selectionStart)}[${string.substring(selectionStart, selectionEnd)}]${string.substring(selectionEnd)}`
  } else {
    return `${string.substring(0, selectionEnd)}]${string.substring(selectionEnd, selectionStart)}[${string.substring(selectionStart)}`
  }
};

export default class FormCreditCardField extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    acceptedTypes: PropTypes.arrayOf(PropTypes.oneOf(Object.values(CardType))).isRequired,
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    errors: PropTypes.array,
    required: PropTypes.bool
  };

  static defaultProps = {
    acceptedTypes: [
      CardType.VISA,
      CardType.MASTERCARD,
      CardType.AMERICAN_EXPRESS
    ]
  };

  state = {
    value: '',
    selectionStart: 0,
    selectionEnd: 0
  }

  // NOTE: We make the input a controlled component within the
  // context of the credit card field so that usages can reset the value
  // via defaultValue without controlling the entire component themselves
  componentWillMount() {
    if (this.props.defaultValue) {
      this.setState({ value: this.props.defaultValue });
    }
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue || '' });
    }
  }

  componentDidUpdate() {
    const { selectionStart, selectionEnd } = this.state;

    // Place the cursor in the right position
    // in the text field, after processing
    //
    // NOTE: This is only done when the input's state
    // isn't what's expected, to avoid triggering buggy
    // mouse selection behaviour
    if (selectionStart !== this.input.selectionStart) {
      this.input.selectionStart = selectionStart;
    }

    if (selectionEnd !== this.input.selectionEnd) {
      this.input.selectionEnd = selectionEnd;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  render() {
    return (
      <div className="mb2">
        <FormInputLabel
          label={this.props.label}
          errors={this._hasErrors()}
          required={this.props.required}
        >
          {this._renderInput()}
        </FormInputLabel>
        {this._renderErrors()}
        {this._renderHelp()}
      </div>
    );
  }

  getMaxLength() {
    const { matchingCardType } = this.state;

    if (!matchingCardType) {
      return FALLBACK_CARD_LENGTH;
    }

    // Calculate the maximum card length for the identified type

    // We take the maximum length the card type presents
    const maxLength = Math.max(...matchingCardType.lengths);

    // And add one for each possible gap character
    const cardGaps = matchingCardType.gaps.length * CARD_GAP_STRING.length;

    return maxLength + cardGaps;
  }

  _renderInput() {
    return (
      <input
        className={classNames("input", { "is-error": this._hasErrors() }, this.props.className)}
        autoComplete="cc-number"
        name={this.props.name}
        type="tel"
        disabled={this.props.disabled}
        value={this.state.value}
        maxLength={this.getMaxLength()}
        placeholder={this.props.placeholder}
        spellCheck={false}
        onChange={this.handleInputChange}
        required={this.props.required}
        ref={(input) => this.input = input}
      />
    );
  }

  handleSelectionChange = () => {
    const { selectionStart, selectionEnd } = this.input;
    this.setState({ selectionStart, selectionEnd });
  };

  handleInputChange = (evt) => {
    const { value } = evt.target;
    let { selectionStart, selectionEnd } = evt.target;
    const { value: prevValue, selectionStart: prevSelectionStart } = this.state;

    console.log(`[handleInputChange] initial cursor: "${cursorDebug(value, selectionStart, selectionEnd)}"`);

    let matchingCardType;
    let processedValue = value;

    const valueDifference = value.length - prevValue.length;

    console.debug(`[handleInputChange] ${ selectionStart < prevSelectionStart ? 'back' : 'for' }wards ${ valueDifference < 0 ? 'dele' : 'inser' }tion`);

    if (valueDifference < 0 && valueDifference >= -(CARD_GAP_STRING.length)) {
      const deleted = prevValue.substring(selectionStart, selectionStart - valueDifference);

      if (/[^0-9]+/g.test(deleted)) {
        // the user has deleted something, but they've managed
        // to only delete something we're ignoring, let's
        // delete the character they *expected* to delete

        if (selectionStart < prevSelectionStart) {
          // they pressed "backspace"
          processedValue = processedValue.substring(0, selectionStart - 1) + processedValue.substring(selectionStart);

          // cursor position needs updating, as we're travelling backwards
          selectionStart -= 1;
          selectionEnd -= 1;
        } else {
          // they pressed "delete"
          processedValue = processedValue.substring(0, selectionStart) + processedValue.substring(selectionStart + 1);
          // cursor doesn't need updating as we're not moving
        }
      }
    }

    console.log(`[handleInputChange] post-backspace cursor: "${cursorDebug(processedValue, selectionStart, selectionEnd)}"`);

    // pre-adjust selection positions to fit processed value
    processedValue = processedValue.replace(/[^0-9]+/g, (match, offset) => {
      const offsetEnd = offset + match.length;

      if (selectionEnd <= offsetEnd) {
        selectionEnd -= Math.max(0, selectionStart - offset);
      }

      if (selectionStart > offset && selectionStart <= offsetEnd) {
        selectionStart = offset;
      }

      return '';
    });

    console.log(`[handleInputChange] post-ignore cursor: "${cursorDebug(processedValue, selectionStart, selectionEnd)}"`);

    if (processedValue.length > 0) {

      matchingCardType = creditCardType(processedValue)
        .filter((card) => this.props.acceptedTypes.indexOf(card.type) !== -1)
        .shift();

      if (matchingCardType) {
        const offsets = [0, ...matchingCardType.gaps, processedValue.length];
        const components = [];

        for (let idx = 0; offsets[idx] < processedValue.length; idx++) {
          const start = offsets[idx];
          const end = Math.min(offsets[idx + 1], processedValue.length);

          if (start > 0) {
            if (selectionStart > start) {
              selectionStart += CARD_GAP_STRING.length;
            }
            if (selectionEnd > start) {
              selectionEnd += CARD_GAP_STRING.length;
            }
          }

          components.push(processedValue.substring(start, end));
        }

        processedValue = components.join(CARD_GAP_STRING);
      }

    }

    console.log(`[handleInputChange] reformatted cursor: "${cursorDebug(processedValue, selectionStart, selectionEnd)}"`);

    this.setState(
      { value: processedValue, matchingCardType, selectionStart, selectionEnd },
      () => {
        this.props.onChange(processedValue, matchingCardType ? matchingCardType.type : null);
      }
    );
  };

  getValue() {
    return this.state.value;
  }

  focus() {
    this.input.focus();
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _hasEmptyValue() {
    return !this.state.value || this.state.value.length === 0;
  }

  _renderErrors() {
    if (this._hasErrors()) {
      return (
        <FormInputErrors errors={this.props.errors} />
      );
    }
  }

  _renderHelp() {
    if (this.props.help) {
      return (
        <FormInputHelp html={this.props.help} />
      );
    }
  }
}
