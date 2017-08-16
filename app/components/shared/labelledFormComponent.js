import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CollapsableFormField from './CollapsableFormField';
import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

export default function labelledFormComponent(FormComponent, { defaultProps, proxyMethods } = {}) {
  class LabelledFormComponent extends React.Component {
    static displayName = `Labelled(${FormComponent.displayName || FormComponent.name || FormComponent})`;

    static propTypes = {
      className: PropTypes.string,
      collapsable: PropTypes.bool,
      defaultValue: PropTypes.string,
      errors: PropTypes.array,
      help: PropTypes.node,
      label: PropTypes.string.isRequired,
      required: PropTypes.bool
    };

    static defaultProps = {
      ...defaultProps,
      collapsable: false
    };

    constructor(props) {
      super(props);

      if (proxyMethods && proxyMethods.length) {
        proxyMethods.forEach((method) => {
          this[method] = (...args) => this.input[method](...args);
        });
      }
    }

    state = {
      collapsed: this.props.collapsable && this._hasEmptyValue() && !this._hasErrors() && this._hasEmptyValue()
    };

    render() {
      const { className, collapsable, errors, label, help, ...props } = this.props;

      if (collapsable) {
        return (
          <CollapsableFormField
            label={label}
            collapsed={this.state.collapsed}
          >
            <FormComponent
              {...props}
              className={classNames("input", { "is-error": this._hasErrors() }, className)}
              ref={(input) => this.input = input}
            />
            <FormInputErrors errors={errors} />
            <FormInputHelp>{help}</FormInputHelp>
          </CollapsableFormField>
        );
      }

      return (
        <div className="mb2">
          <FormInputLabel
            label={label}
            errors={this._hasErrors()}
            required={props.required}
          >
            <FormComponent
              {...props}
              className={classNames("input", { "is-error": this._hasErrors() }, className)}
              ref={(input) => this.input = input}
            />
          </FormInputLabel>
          <FormInputErrors errors={errors} />
          <FormInputHelp>{help}</FormInputHelp>
        </div>
      );
    }

    _hasErrors() {
      return this.props.errors && this.props.errors.length > 0;
    }

    _hasEmptyValue() {
      return !this.value || this.value.length === 0;
    }

    // DOM Proxy Zone
    get value() {
      return this.input ? this.input.value : this.props.defaultValue;
    }

    focus() {
      this.input.focus();
    }
  }

  return LabelledFormComponent;
}
