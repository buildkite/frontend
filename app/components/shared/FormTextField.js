import React from 'react';
import classNames from 'classnames';

import CollapsableFormField from './CollapsableFormField';
import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

class FormTextField extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    help: React.PropTypes.string,
    spellCheck: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    collapsable: React.PropTypes.bool,
    errors: React.PropTypes.array,
    required: React.PropTypes.bool
  };

  static defaultProps = {
    spellCheck: false,
    collapsable: false
  };

  state = {
    collapsed: this.props.collapsable && this._hasEmptyValue() && !this._hasErrors() && this._hasEmptyValue()
  };

  render() {
    if (this.props.collapsable) {
      return (
        <CollapsableFormField label={this.props.label} collapsed={this.state.collapsed}>
          {this._renderInput()}
          {this._renderErrors()}
          {this._renderHelp()}
        </CollapsableFormField>
      );
    } else {
      return (
        <div className="mb2">
          <FormInputLabel label={this.props.label} errors={this._hasErrors()}>
            {this._renderInput()}
          </FormInputLabel>
          {this._renderErrors()}
          {this._renderHelp()}
        </div>
      );
    }
  }

  getValue() {
    return this.input.value;
  }

  focus() {
    this.input.focus();
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _hasEmptyValue() {
    return !this.props.value || this.props.value.length === 0;
  }

  _renderErrors() {
    if (this._hasErrors()) {
      return (
        <FormInputErrors errors={this.props.errors}/>
      );
    }
  }

  _renderHelp() {
    if (this.props.help) {
      return (
        <FormInputHelp html={this.props.help}/>
      );
    }
  }

  _renderInput() {
    return (
      <input
        className={classNames("input", { "is-error": this._hasErrors() }, this.props.className)}
        name={this.props.name}
        type="text"
        defaultValue={this.props.value}
        placeholder={this.props.placeholder}
        spellCheck={this.props.spellCheck}
        onChange={this.props.onChange}
        required={this.props.required}
        ref={(input) => this.input = input}
      />
    );
  }
}

export default FormTextField;
