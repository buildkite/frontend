import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CollapsableFormField from './CollapsableFormField';
import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';

export default function collapsibleFormComponent(FormComponent) {
  return class CollapsibleFormComponent extends React.Component {
    static displayName = `Collapsible(${FormComponent.displayName || FormComponent.name || FormComponent})`;

    static propTypes = {
      className: PropTypes.string,
      defaultValue: PropTypes.string,
      errors: PropTypes.array,
      help: PropTypes.node,
      label: PropTypes.string.isRequired,
      required: PropTypes.bool
    };

    constructor(props) {
      super(props);

      if (this.constructor.proxyMethods && this.constructor.proxyMethods.length) {
        this.constructor.proxyMethods.forEach((method) => {
          this[method] = (...args) => this.input[method](...args);
        });
      }
    }

    state = {
      collapsed: this._hasEmptyValue() && !this._hasErrors() && this._hasEmptyValue()
    };

    render() {
      const { className, errors, label, help, ...props } = this.props;

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
  };
}
