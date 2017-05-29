import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from './Icon';
import Spinner from './Spinner';

export default class SearchField extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    borderless: PropTypes.bool.isRequired,
    searching: PropTypes.bool.isRequired,
    autofocus: PropTypes.bool.isRequired
  };

  static defaultProps = {
    placeholder: 'Search…',
    borderless: false,
    searching: false,
    autofocus: false
  };

  state = {
    value: ''
  }

  // NOTE: We make the input a controlled component within the
  // context of the search field so that usages can reset the value
  // via defaultValue without controlling the entire component themselves
  componentWillMount() {
    if (this.props.defaultValue) {
      this.setState({ value: this.props.defaultValue });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue || '' });
    }
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  clear() {
    this._inputNode.value = '';
  }

  focus() {
    this._inputNode.focus();
  }

  blur() {
    this._inputNode.blur();
  }

  render() {
    const wrapperClassName = classNames(
      'relative',
      { 'dark-gray': !this.state.value },
      this.props.className
    );

    return (
      <div
        className={wrapperClassName}
        style={this.props.style}
      >
        {this.renderIcon()}
        <input
          type="text"
          className={classNames('input', { borderless: this.props.borderless })}
          style={{
            margin: 0,
            paddingLeft: '2em'
          }}
          ref={(_inputNode) => this._inputNode = _inputNode}
          value={this.state.value}
          onChange={this.handleInputChange}
          onKeyDown={this.props.onKeyDown}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }

  renderIcon() {
    const iconSize = '1em';
    const className = 'absolute pointer-events-none';
    const style = { left: '.75em', marginTop: '-.5em', top: '50%' };

    if (this.props.searching) {
      return (
        <Spinner
          size={iconSize}
          color={false}
          className={className}
          style={style}
        />
      );
    } else {
      return (
        <Icon
          icon="search"
          className={className}
          style={{
            color: 'currentColor',
            width: iconSize,
            height: iconSize,
            ...style
          }}
        />
      );
    }
  }

  handleInputChange = (evt) => {
    // Get a copy of the target otherwise the event will be cleared between now
    // and when the timeout happens
    const { value } = evt.target;

    // If a timeout is already present, clear it since the user is still typing
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    // Update the component-level state immediately, so keypresses aren't swallowed
    this.setState({ value });

    // Instead of doing a search on each keypress, do it a few ms after they've
    // stopped typing
    this._timeout = setTimeout(() => {
      this.props.onChange(value);
      delete this._timeout;
    }, 100);
  };
}
