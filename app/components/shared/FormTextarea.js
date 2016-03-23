import React from 'react';
import classNames from 'classnames';
import autosize from 'autosize';

import CollapsableFormField from './CollapsableFormField';
import FormInputHelp from './FormInputHelp';
import FormInputErrors from './FormInputErrors';
import FormInputLabel from './FormInputLabel';

class FormTextarea extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    rows: React.PropTypes.number.isRequired,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    help: React.PropTypes.string,
    spellCheck: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    collapsable: React.PropTypes.bool,
    resizable: React.PropTypes.string,
    autoresize: React.PropTypes.bool,
    className: React.PropTypes.string,
    errors: React.PropTypes.array
  };

  static defaultProps = {
    spellCheck: false,
    collapsable: false,
    autoresize: false
  };

  state = {
    collapsed: this.props.collapsable && this._hasEmptyValue() && !this._hasErrors() && this._hasEmptyValue()
  };

  componentDidMount() {
    if (this.props.autoresize) {
      autosize(this._textarea);
    }
  }

  componentWillUnmount() {
    if (this.props.autoresize) {
      autosize.destroy(this._textarea);
    }
  }

  render() {
    if (this.props.collapsable) {
      return (
        <CollapsableFormField label={this.props.label} collapsed={this.state.collapsed}>
          {this._renderTextArea()}
          {this._renderErrors()}
          {this._renderHelp()}
        </CollapsableFormField>
      );
    } else {
      return (
        <div className="mb2">
          <FormInputLabel label={this.props.label} errors={this._hasErrors()}>
            {this._renderTextArea()}
          </FormInputLabel>
          {this._renderErrors()}
          {this._renderHelp()}
        </div>
      );
    }
  }

  // In some cases the initial height can be incorrect and you need to explicit tell
  // us to autosize the textarea for you. See:
  // http://www.jacklmoore.com/autosize/#faq-hidden
  updateAutoresize() {
    if (this.props.autoresize) {
      autosize.update(this._textarea);
    }
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }

  _hasEmptyValue() {
    return !this.props.value || this.props.value.length == 0;
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

  _renderTextArea() {
    var style = {}
    if (this.props.resizable) {
      style.resize = this.props.resizable;
    }

    return (
      <textarea
        className={classNames("form-control", this.props.className)}
        name={this.props.name}
        type="text"
        defaultValue={this.props.value}
        placeholder={this.props.placeholder}
        spellCheck={this.props.spellCheck}
        onChange={this.props.onChange}
        rows={this.props.rows}
        style={style}
        ref={(c) => this._textarea = c} />
    );
  }
}

export default FormTextarea;