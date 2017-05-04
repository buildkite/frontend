import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from './Icon';
import Spinner from './Spinner';

export default class SearchField extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    searching: PropTypes.bool.isRequired
  };

  defaultProps = {
    placeholder: 'Search…',
    searching: false
  };

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
      <div className={classNames('relative', this.props.className)}>
        {this.renderIcon()}
        <input
          type="text"
          className="input"
          style={{ paddingLeft: 28 }}
          ref={(_inputNode) => this._inputNode = _inputNode}
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
    const iconSize = 15;
    const className = 'absolute pointer-events-none';
    const style = { left: 8, top: 9 };

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
          className={classNames('gray', className)}
          style={{ width: iconSize, height: iconSize, ...style }}
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
