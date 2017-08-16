import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AutosizingTextarea from './AutosizingTextarea';

import CollapsableFormField from './CollapsableFormField';
import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

class FormTextarea extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.node,
    spellCheck: PropTypes.bool,
    onChange: PropTypes.func,
    collapsable: PropTypes.bool,
    resizable: PropTypes.string,
    autoresize: PropTypes.bool,
    className: PropTypes.string,
    errors: PropTypes.array,
    tabIndex: PropTypes.number,
    required: PropTypes.bool
  };

  static defaultProps = {
    spellCheck: false,
    collapsable: false,
    autoresize: false
  };

  state = {
    collapsed: this.props.collapsable && this._hasEmptyValue() && !this._hasErrors() && this._hasEmptyValue()
  };

  render() {
    if (this.props.collapsable) {
      return (
        <CollapsableFormField
          label={this.props.label}
          collapsed={this.state.collapsed}
        >
          {this._renderTextArea()}
          <FormInputErrors errors={this.props.errors} />
          <FormInputHelp>{this.props.help}</FormInputHelp>
        </CollapsableFormField>
      );
    }

    return (
      <div className="mb2">
        <FormInputLabel
          label={this.props.label}
          errors={this._hasErrors()}
          required={this.props.required}
        >
          {this._renderTextArea()}
        </FormInputLabel>
        <FormInputErrors errors={this.props.errors} />
        <FormInputHelp>{this.props.help}</FormInputHelp>
      </div>
    );
  }

  updateAutoresize() {
    if (this.props.autoresize) {
      this._textarea.updateAutoresize();
    }
  }

  getValue() {
    return this._textarea.value;
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _hasEmptyValue() {
    return !this.props.value || this.props.value.length === 0;
  }

  _renderTextArea() {
    const props = {
      className: classNames("input", this.props.className),
      name: this.props.name,
      defaultValue: this.props.value,
      placeholder: this.props.placeholder,
      spellCheck: this.props.spellCheck,
      onChange: this.props.onChange,
      rows: this.props.rows,
      ref: (_textarea) => this._textarea = _textarea,
      style: {
        resize: this.props.resizable
      },
      tabIndex: this.props.tabIndex,
      required: this.props.required
    };

    if (this.props.autoresize) {
      return <AutosizingTextarea {...props} />;
    }

    return <textarea {...props} />;
  }
}

export default FormTextarea;
