import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FormInputErrors from './FormInputErrors';
import FormInputHelp from './FormInputHelp';

export default class FormCheckbox extends React.PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    name: PropTypes.string,
    checked: PropTypes.bool,
    help: PropTypes.node,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    errors: PropTypes.array
  };

  render() {
    return (
      <div className="mb2">
        <label className="inline-block pl4 cursor-pointer">
          <input
            name={this.props.name}
            type="checkbox"
            checked={this.props.checked}
            onChange={this.props.onChange}
            className="absolute checkbox"
            style={{
              marginLeft: "-20px",
              cursor: this.props.disabled ? "not-allowed" : "inherit"
            }}
            disabled={this.props.disabled}
            ref={(_checkbox) => this._checkbox = _checkbox}
          />
          <span className={classNames('semi-bold', { red: this._hasErrors() })}>{this.props.label}</span><br />
          {this._renderHelp()}
        </label>
        {this._renderErrors()}
      </div>
    );
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
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
        <FormInputHelp>{this.props.help}</FormInputHelp>
      );
    }
  }
}
