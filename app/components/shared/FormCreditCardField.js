import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import creditCardType, { types as CardType } from 'credit-card-type';

import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

// 19 is the longest length of any
// accepted card type as of July 2017
const FALLBACK_CARD_LENGTH = 19;
const CARD_GAP_STRING = ' ';

export default class FormCreditCardField extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    acceptedTypes: PropTypes.arrayOf(
      PropTypes.oneOf(Object.values(CardType))
    ).isRequired,
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
    // isn't what's expected, to avoid triggering weird
    // mouse selection behaviour!
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
    // Calculate the maximum card length for the identified type
    const { matchingCardType } = this.state;

    if (!matchingCardType) {
      return FALLBACK_CARD_LENGTH;
    }

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
    // Update the state with the input's selection when we hear
    // from the DOM that the selection has changed *somewhere*
    const { selectionStart, selectionEnd } = this.input;
    this.setState({ selectionStart, selectionEnd });
  };

  handleInputChange = (evt) => {
    // This handler might look scary, but has 3 simple phases;
    //
    //  1. Compensate for deletions which deleted only whitespace
    //  2. Convert the input's value into a raw numeric string
    //  3. Format the number to match the detected card type's format
    //
    // At each phase, it adjusts `selectionStart` and `selectionEnd`
    // to maintain continuity for the user.
    //
    // Let's go!

    let { value, selectionStart, selectionEnd } = evt.target;
    const { value: prevValue, selectionStart: prevSelectionStart } = this.state;

    // PHASE 1: Compensate for deletions which deleted only whitespace
    //
    // This phase only changes things if there's a *negative* change in
    // value length. This means that if the user has backspaced (or deleted)
    // only a non-numeric character, we push the cursor one character further
    // so that they don't get stuck in a whitespace trough.

    const valueDifference = value.length - prevValue.length;

    // for future reference:
    //
    // * if `selectionStart < prevSelectionStart`, we're moving backwards,
    //   otherwise forwards (always twirling, twirling, twirling, etc.)
    // * if `valueDifference < 0`, we're deleting one or more characters
    //
    // this is useful debug info!

    // if the value's length has changed negatively, but not
    // by more than the length of our gap string
    if (valueDifference < 0 && valueDifference >= -(CARD_GAP_STRING.length)) {
      // grab the deleted part of the string
      const deleted = prevValue.substring(selectionStart, selectionStart - valueDifference);

      // and check it's only whitespace
      if (/[^0-9]+/g.test(deleted)) {
        // so here, we know the user has deleted something, but
        // only something we're ignoring. let's delete the
        // character they likely *expected* to delete

        if (selectionStart < prevSelectionStart) {
          // if they pressed "backspace," delete the character before the cursor
          value = value.substring(0, selectionStart - 1) + value.substring(selectionStart);

          // the cursor position needs updating, as we're travelling backwards
          selectionStart -= 1;
          selectionEnd -= 1;
        } else {
          // if they pressed "delete," delete the character after the cursor
          value = value.substring(0, selectionStart) + value.substring(selectionStart + 1);
          // cursor doesn't need updating as we're not moving it!
        }
      }
    }

    // PHASE 2: Convert the input's value into a raw numeric string
    //
    // This phase applies when we've formatted the string, and if the
    // user enters characters we don't accept. Anything that isn't 0-9
    // is stripped, and the cursor positions updated to match.
    // This is done so that the card type can be determined, and so we
    // have a known-good place to start friendly-formatting the number.

    // We calculate compensation values separately from applying because
    // offsets within the `replace` callback are based on the original value!
    let selectionEndPreCompensation = 0;
    let selectionStartPreCompensation = 0;

    value = value.replace(
      /[^0-9]+/g,
      (match, offset) => {
        if (selectionEnd > offset) {
          selectionEndPreCompensation -= match.length;
        }

        if (selectionStart > offset) {
          selectionStartPreCompensation -= match.length;
        }

        return '';
      }
    );

    selectionEnd += selectionEndPreCompensation;
    selectionStart += selectionStartPreCompensation;

    // PHASE 3: Format the number to match the detected card type's format
    //
    // This phase always applies if the value is not currently empty, and
    // if we find a matching card type. We split the card number into chunks
    // to match each gap in the format specified by 'credit-card-type'.
    // For each gap we're going to add, we bump the cursor position to compensate.

    // Again, we calculate these values separate from applying because
    // offsets within the loop are based upon the original value!
    let selectionEndPostCompensation = 0;
    let selectionStartPostCompensation = 0;

    let matchingCardType;

    if (value.length > 0) {

      // Filter the possible card types by those we accept, then grab the first
      matchingCardType = creditCardType(value)
        .filter((card) => this.props.acceptedTypes.indexOf(card.type) !== -1)
        .shift();

      if (matchingCardType) {
        const offsets = [0, ...matchingCardType.gaps, value.length];
        const chunks = [];

        for (let idx = 0; offsets[idx] < value.length; idx++) {
          const start = offsets[idx];
          const end = Math.min(offsets[idx + 1], value.length);

          if (start > 0) {
            if (selectionEnd >= start) {
              selectionEndPostCompensation += CARD_GAP_STRING.length;
            }

            if (selectionStart >= start) {
              selectionStartPostCompensation += CARD_GAP_STRING.length;
            }
          }

          chunks.push(value.substring(start, end));
        }

        value = chunks.join(CARD_GAP_STRING);
      }

    }

    selectionEnd += selectionEndPostCompensation;
    selectionStart += selectionStartPostCompensation;

    // after we've done all this, we setState with the new value, as well
    // as the card type (so that the field can adjust to fit its values),
    // and the selection region, so that the field can be updated with it

    this.setState(
      { value, matchingCardType, selectionStart, selectionEnd },
      () => {
        this.props.onChange(value, matchingCardType ? matchingCardType.type : null);
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
