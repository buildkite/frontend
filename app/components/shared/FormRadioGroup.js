import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';

class FormRadioGroup extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string,
        label: PropTypes.string.isRequired,
        help: PropTypes.string,
        value: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.string
        ]).isRequired
      })
    ).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    label: PropTypes.string,
    name: PropTypes.string,
    reauired: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    errors: PropTypes.array
  };

  inputs = []

  render() {
    return (
      <div className={classNames("mb2", this.props.className)}>
        {this._renderLabel()}
        {this._renderInputs()}
        {this._renderErrors()}
      </div>
    );
  }

  getValue() {
    return this.input.checked;
  }

  focus() {
    this.input.focus();
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _renderLabel() {
    if(this.props.label) {
      return (
        <label className={classNames("block bold", { "red": this._hasErrors() })}>
          {this.props.label}
          {this.props.required && <span className="dark-gray h6 semi-bold"> — Required</span>}
        </label>
      )
    }
  }

  _renderErrors() {
    if (this._hasErrors()) {
      return (
        <FormInputErrors errors={this.props.errors} />
      );
    }
  }

  _renderInputs() {
    return this.props.options.map(
      (option, index) => (
        <div key={index} className="mt1">
          <label className="mt1 inline-block pl4">
            <div className="flex">
              <input
                className={classNames('absolute', { "is-error": this._hasErrors() }, option.className)}
                style={{ marginLeft: '-20px' }}
                name={this.props.name}
                type="radio"
                defaultChecked={this.props.value === option.value}
                value={option.value}
                onChange={this.props.onChange}
                ref={(input) => this.inputs[index] = input}
              />
              <span className="bold block" style={{ marginBottom: -5 }}> {option.label}</span>
              {option.badge && <div className="ml1 regular small border border-gray rounded dark-gray px1">{option.badge}</div>}
            </div>
            {option.help && <FormInputHelp html={option.help} />}
          </label>
        </div>
      )
    );
  }
}

export default FormRadioGroup;
