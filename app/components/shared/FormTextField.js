import React from 'react';
import CollapsableFormField from './CollapsableFormField';

class FormTextField extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
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

  state = {
    collapsed: this.props.collapsable && this.hasEmptyValue()
  };

  hasEmptyValue() {
    return !this.props.value || this.props.value.length === 0;
  }

  render() {
    if(this.props.help) {
      var helpNode = (
        <p className="mt1 mb0 p0 dark-gray" dangerouslySetInnerHTML={{__html: this.props.help}} />
      );
    }

    var inputNode = (
      <input className="input"
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
        <div className="mb2">
	  <label>
	    <div className="bold mb1">{this.props.label}</div>
	    {inputNode}
	    {helpNode}
	  </label>
	</div>
      );
    }
  }
}

export default FormTextField
