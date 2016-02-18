import React from 'react';
import CollapsableFormField from './CollapsableFormField';

var _textFieldCounter = 0;

class FormTextField extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    help: React.PropTypes.string,
    spellCheck: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    collapsable: React.PropTypes.bool
  };

  static defaultProps = {
    spellCheck: false,
    collapsable: false
  };

  constructor(props) {
    super(props);

    this.state = {
      id: "text-field-" + (_textFieldCounter += 1),
      collapsed: this.props.collapsable && this.hasEmptyValue()
    };
  }

  hasEmptyValue() {
    return !this.props.value || this.props.value.length === 0;
  }

  render() {
    if(this.props.help) {
      var helpNode = (
        <p className="hint-block" dangerouslySetInnerHTML={{__html: this.props.help}} />
      );
    }

    var inputNode = (
      <input className="form-control"
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
          {helpNode}
        </CollapsableFormField>
      )
    } else {
      return (
        <div className="form-group">
          <label className="control-label" htmlFor={this.state.id}>{this.props.label}</label>
          <div>
            {inputNode}
            {helpNode}
          </div>
        </div>
      );
    }
  }
}

export default FormTextField
