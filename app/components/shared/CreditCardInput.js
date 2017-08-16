import React from 'react';
import PropTypes from 'prop-types';
import creditCardType, { types as CardType } from 'credit-card-type';

// 19 is the longest (unformatted) length of
// any accepted card type as of July 2017
const FALLBACK_CARD_LENGTH = 19;
const CARD_GAP_STRING = ' ';

const maxLengthForCardType = (cardType) => {
  // Calculate the maximum card length for the supplied type
  if (!cardType) {
    return FALLBACK_CARD_LENGTH;
  }

  // We take the maximum length the card type presents
  const maxLength = Math.max(...cardType.lengths);

  // And add one for each possible gap character
  const cardGaps = cardType.gaps.length * CARD_GAP_STRING.length;

  return maxLength + cardGaps;
};

export default class CreditCardInput extends React.PureComponent {
  static propTypes = {
    acceptedTypes: PropTypes.arrayOf(
      PropTypes.oneOf(Object.keys(CardType).map((name) => CardType[name]))
    ).isRequired,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
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
    this.input.addEventListener('paste', this.handlePaste);
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
    if (selectionStart !== this.input.selectionStart || selectionEnd !== this.input.selectionEnd) {
      this.input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.handleSelectionChange);
    this.input.removeEventListener('paste', this.handlePaste);
  }

  render() {
    // We're pulling out these props because they're used
    // internally and shouldn't be passed on to the input itself
    const {
      acceptedTypes, // eslint-disable-line no-unused-vars
      defaultValue,  // eslint-disable-line no-unused-vars
      onChange,      // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    return (
      <input
        autoComplete="cc-number"
        type="tel"
        maxLength={this.getMaxLength()}
        spellCheck={false}
        value={this.state.value}
        onChange={this.handleInputChange}
        ref={(input) => this.input = input}
        {...props}
      />
    );
  }

  getMaxLength() {
    return maxLengthForCardType(this.state.matchingCardType);
  }

  handleSelectionChange = () => {
    // Update the state with the input's selection when we hear
    // from the DOM that the selection has changed *somewhere*
    const { selectionStart, selectionEnd } = this.input;
    this.setState({ selectionStart, selectionEnd });
  };

  handleInputChange = (evt) => {
    const { value, selectionStart, selectionEnd } = evt.target;
    this.processInputChange(value, selectionStart, selectionEnd);
  };

  handlePaste = (evt) => {
    if (!evt.clipboardData) {
      // we can't do anything in this situation, alas
      return;
    }

    // When pasting, we need extra handling so pastes aren't truncated,
    // because the HTML form's length limit will prevent the full pasted
    // value from reaching the handler.
    // To fix this, we'll instead update the data ourselves!
    const { value, selectionStart, selectionEnd } = evt.target;

    // We grab the pasted string from the clipboard
    const pastedValue = evt.clipboardData.getData('text/plain');

    // Splice the new value into the old one
    const newValue = `${value.substring(0, selectionStart)}${pastedValue}${value.substring(selectionEnd)}`;
    const newCursorPosition = selectionStart + pastedValue.length;

    // And pass it on to our usual handler
    this.processInputChange(newValue, newCursorPosition, newCursorPosition);

    // And then, once all that's worked, we cancel the original paste event
    evt.preventDefault();
  };

  processInputChange(value, selectionStart, selectionEnd) {
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

    // after that we truncate the value to fit the card's maximum length
    const cardLength = maxLengthForCardType(matchingCardType);
    value = value.substring(0, cardLength);

    // and clamp selection region to the extents of the value
    selectionEnd = Math.min(cardLength, selectionEnd + selectionEndPostCompensation);
    selectionStart = Math.min(cardLength, selectionStart + selectionStartPostCompensation);

    // after we've done all this, we setState with the new value, as well
    // as the card type (so that the field can adjust to fit its values),
    // and the selection region, so that the field can be updated with it

    this.setState(
      { value, matchingCardType, selectionStart, selectionEnd },
      () => {
        this.props.onChange(value, matchingCardType ? matchingCardType.type : null);
      }
    );
  }

  // DOM Proxy Zone
  get value() {
    return this.state.value;
  }

  focus() {
    this.input.focus();
  }
}
