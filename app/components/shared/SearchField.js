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
    return (
      <div
        className={classNames('dark-gray relative', this.props.className)}
        style={this.props.style}
      >
        {this.renderIcon()}
        <input
          type="text"
          className={classNames('input', { borderless: this.props.borderless })}
          style={{
            margin: 0,
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            paddingLeft: '2em'
          }}
          ref={(_inputNode) => this._inputNode = _inputNode}
          defaultValue={this.props.defaultValue}
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
    const iconSize = '1.1em';
    const className = 'absolute pointer-events-none';
    const style = { left: '.6em', top: '.64em' };

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
          style={{ color: 'currentColor', width: iconSize, height: iconSize, ...style }}
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

    // Instead of doing a search on each keypress, do it a few ms after they've
    // stopped typing
    this._timeout = setTimeout(() => {
      this.props.onChange(value);
      delete this._timeout;
    }, 100);
  };
}
