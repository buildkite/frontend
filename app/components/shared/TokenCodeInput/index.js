// @flow

import * as React from "react";
import FormInputErrors from 'app/components/shared/FormInputErrors';
import FormInputHelp from 'app/components/shared/FormInputHelp';
import classNames from 'classnames';
import styled, { keyframes } from 'styled-components';

const CHARACTER_WIDTH = 40;

const Token = styled.div`
  position: relative;
  border: 1px solid ${(props) => props.focused ? '#888' : '#CCC'};
  color: #555555;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
`;

const Character = styled.div`
  font-size: 1.6rem;
  height: 50px;
  width: ${CHARACTER_WIDTH}px;
  border-right: 1px solid #ccc;
  text-align: center;
  line-height: 50px;
  position: relative;

  &:last-child {
    border-right: none;
  }
`;

const WrappedInput = styled.input`
  opacity: 1;
  width: ${CHARACTER_WIDTH}px;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: transparent;
  position: absolute;
  text-align: center;
  line-height: 50px;
  font-size: 18px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  border-top-left-radius: ${({ first }) => first ? '4px' : 0};
  border-bottom-left-radius: ${({ first }) => first ? '4px' : 0};
  border-top-right-radius: ${({ last }) => last ? '4px' : 0};
  border-bottom-right-radius: ${({ last }) => last ? '4px' : 0};

  &:focus {
    box-shadow: 0 0 2px 1px rgb(94, 200, 135);
  }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Caret = styled.div`
  animation: ${pulse} 1s step-end infinite;
  width: 2px;
  height: 60%;
  position: absolute;
  background: #ccc;
  display: block;
`;

type Props = {
  maxLength: number,
  value: string,
  disabled?: boolean,
  help?: React.Node,
  onChange: (value: string) => void,
  onCodeComplete: (value: string) => void,
  errors: ?Array<*>
};

type CharArray = Array<Array<string>>;

type State = {
  chars: CharArray,
  focused: boolean,
  length: number
};

export default class TokenCodeInput extends React.PureComponent<Props, State> {
  valueFilter = new RegExp(/^\d+$/);
  inputRef: React.Ref<typeof WrappedInput>;

  static defaultProps = {
    maxLength: 6,
    disabled: false
  }

  static toChars(value: string, length: number): CharArray {
    const chars = value.split('');
    return [...Array(length).keys()].map((index: number) => [`char${index}`, chars[index]]);
  }

  static getDerivedStateFromProps(props: Props) {
    return {
      length: props.value.split('').length,
      chars: TokenCodeInput.toChars(props.value, props.maxLength)
    };
  }

  constructor(props: Props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      focused: false,
      length: props.value.length,
      chars: TokenCodeInput.toChars(props.value, props.maxLength)
    };
  }

  get length(): number {
    return this.props.value.length;
  }

  get inputOffset(): number {
    return Math.min(
      this.state.length * CHARACTER_WIDTH,
      (this.props.maxLength - 1) * CHARACTER_WIDTH
    );
  }

  render() {
    const hasErrors = this.props.errors && this.props.errors.length > 0;

    return (
      <div>
        <div className="flex items-center justify-center">
          <Token
            onClick={this.handleClick}
            className={classNames('flex', {
              'is-error': hasErrors,
              'is-disabled': this.props.disabled
            })}
            style={{ width: 'auto', padding: '0' }}
            focused={this.state.focused}
          >
            <WrappedInput
              type="tel"
              innerRef={this.inputRef}
              autoFocus={true}
              disabled={this.props.disabled}
              value={this.props.value}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              first={this.state.length === 0}
              last={this.state.length === (this.props.maxLength - 1)}
              style={{ transform: `translateX(${this.inputOffset}px)` }}
            />
            {this.state.chars.map(([key, char], index) => (
              <Character key={key} className="monospace flex items-center justify-center">
                {this.state.focused && index === this.length ? <Caret /> : char}
              </Character>
            ))}
          </Token>
        </div>
        <FormInputErrors className="center" errors={this.props.errors} />
        <FormInputHelp>{this.props.help}</FormInputHelp>
      </div>
    );
  }

  validCodeValue = (value: string) => {
    if (value === "") {
      return true;
    }
    return this.valueFilter.test(value);
  }

  focus = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
      this.inputRef.current.value = '';
      this.inputRef.current.value = this.props.value;
    }
  }

  handleClick = () => {
    this.focus();
  }

  handleKeyDown = (event: SyntheticEvent<HTMLInputElement>) => {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    switch (event.keyCode) {
      case LEFT_ARROW:
      case RIGHT_ARROW:
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  handleFocus = () => {
    this.setState({ focused: true });
  }

  handleBlur = () => {
    this.setState({ focused: false });
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (this.props.disabled) {
      return;
    }

    const lastValue = this.props.value;
    let { value: nextValue } = event.currentTarget;

    if (nextValue.length <= this.props.maxLength && this.validCodeValue(nextValue)) {
      if (nextValue.length === (lastValue.length - 1)) {
        nextValue = lastValue.slice(0, nextValue.length);
      }
      this.props.onChange(nextValue);
    }
    if (nextValue.length === this.props.maxLength) {
      this.props.onCodeComplete(nextValue);
    }
  }
}