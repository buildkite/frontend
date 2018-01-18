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
        help: PropTypes.node,
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
    required: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.array
  };

  render() {
    return (
      <div className={classNames("mb2", this.props.className)}>
        {this._renderLabel()}
        {this._renderInputs()}
        <FormInputErrors errors={this.props.errors} />
      </div>
    );
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _renderLabel() {
    if (this.props.label) {
      return (
        <label className={classNames("block bold", { "red": this._hasErrors() })}>
          {this.props.label}
          {this.props.required && <span className="dark-gray h6 semi-bold"> — Required</span>}
        </label>
      );
    }
  }

  _renderInputs() {
    // Radio boxes need to be "managed" inputs (i.e. we can't use
    // defaultChecked) so we can use onChange event handlers. `onChange` never
    // fires for subsequent changes if you use `defaultChecked`
    return this.props.options.map(
      (option, index) => (
        <div key={index} className="mt1">
          <label className="mt1 inline-block pl4">
            <div className="flex">
              <input
                className={classNames("absolute radio", { "is-error": this._hasErrors() }, option.className)}
                style={{ marginLeft: '-20px' }}
                name={this.props.name}
                type="radio"
                checked={this.props.value === option.value}
                value={option.value}
                onChange={this.props.onChange}
              />
              <span className="bold block" style={{ marginBottom: -5 }}> {option.label}</span>
              {option.badge && <div className="ml1 regular small border border-gray rounded dark-gray px1">{option.badge}</div>}
            </div>
            <FormInputHelp>{option.help}</FormInputHelp>
          </label>
        </div>
      )
    );
  }
}

export default FormRadioGroup;
