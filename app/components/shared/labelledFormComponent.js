import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

export default function labelledFormComponent(FormComponent) {
  return class LabelledFormComponent extends React.Component {
    static displayName = `Labelled(${FormComponent.displayName || FormComponent.name || FormComponent})`;

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

    render() {
      const { className, errors, label, help, ...props } = this.props;

      const hasErrors = this.props.errors && this.props.errors.length > 0;

      return (
        <div className="mb2">
          <FormInputLabel
            label={label}
            errors={hasErrors}
            required={props.required}
          >
            <FormComponent
              {...props}
              className={classNames('input', { 'is-error': hasErrors }, className)}
              ref={(input) => this.input = input}
            />
          </FormInputLabel>
          <FormInputErrors errors={errors} />
          <FormInputHelp>{help}</FormInputHelp>
        </div>
      );
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
