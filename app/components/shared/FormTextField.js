import React from 'react';
import classNames from 'classnames';

import CollapsableFormField from './CollapsableFormField';

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
    errors: React.PropTypes.array
  };

  static defaultProps = {
    spellCheck: false,
    collapsable: false
  };

  state = {
    collapsed: this.props.collapsable && this.hasEmptyValue() && !this.hasErrors() && this.hasEmptyValue()
  };

  render() {
    let hasErrors = this.hasErrors();

    let helpNode;
    if(this.props.help) {
      helpNode = (
        <p className="mt1 mb0 p0 dark-gray" dangerouslySetInnerHTML={{__html: this.props.help}} />
      );
    }

    let errorNode;
    if(hasErrors) {
      errorNode = <p className="mt1 mb2 p0 red">{this.props.errors.join(", ")}</p>
    }

    let inputNode = (
      <input className={classNames("input", { "is-error": hasErrors }, this.props.className)}
        id={this.state.id}
        name={this.props.name}
        type="text"
        defaultValue={this.props.value}
        placeholder={this.props.placeholder}
        spellCheck={this.props.spellCheck}
        onChange={this.props.onChange} />
    );

    if (this.props.collapsable) {
      return (
        <CollapsableFormField label={this.props.label} collapsed={this.state.collapsed}>
          {inputNode}
          {errorNode}
          {helpNode}
        </CollapsableFormField>
      )
    } else {
      return (
        <div className="mb2">
          <label>
            <div className={classNames("bold mb1", { "red": hasErrors })}>{this.props.label}</div>
            {inputNode}
          </label>
          {errorNode}
          {helpNode}
        </div>
      );
    }
  }

  hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  hasEmptyValue() {
    return !this.props.value || this.props.value.length === 0;
  }
}

export default FormTextField
