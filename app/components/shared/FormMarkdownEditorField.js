import React from 'react';
import MarkdownEditor from '../../lib/MarkdownEditor';
import autoresizeTextarea from '../../lib/autoresizeTextarea';

class FormMarkdownEdtiorField extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    rows: React.PropTypes.number
  };

  componentDidMount() {
    this.markdownEditor = new MarkdownEditor(this.textarea);
    autoresizeTextarea(this.textarea);
  }

  componentWillUnmount() {
    delete this.markdownEditor;
  }

  render() {
    return (
      <div>
        <div className="mb2">
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleBoldButtonClick}><i className="fa fa-bold"></i></button>
          <button className="btn btn-outline border-gray rounded mr3" onClick={this._handleItalicButtonClick}><i className="fa fa-italic"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleQuoteButtonClick}><i className="fa fa-quote-right"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleCodeButtonClick}><i className="fa fa-code"></i></button>
          <button className="btn btn-outline border-gray rounded mr3" onClick={this._handleLinkButtonClick}><i className="fa fa-link"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleBulletedListButtonClick}><i className="fa fa-list"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleNumberedListButtonClick}><i className="fa fa-list-ol"></i></button>
        </div>
        <textarea
          id={this.props.id}
          name={this.props.name}
          placeholder={this.props.placeholder}
          defaultValue={this.props.value}
          rows={this.props.rows}
          onChange={this._handleOnChange}
          onPaste={this._handleOnPaste}
          onDrop={this._handleOnDrop}
          ref={c => this.textarea = c}
          style={{overflowY: "hidden", resize: "vertical"}}
          className="form-control" />
      </div>
    );
  }

  _handleBoldButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.bold();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleItalicButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.italic();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleQuoteButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.quote();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleNumberedListButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.numberedList();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleBulletedListButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.bulletedList();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleCodeButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.code();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleLinkButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.link();
    autoresizeTextarea(this.textarea);
    this.textarea.focus();
  };

  _handleOnDrop = (e) => {
    e.preventDefault();
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      var f = e.dataTransfer.files[i];
      modifyTextArea(this.textarea, "[{s}" + f.name + "{s}]");
    }
  };

  _handleOnPaste = (e) => {
    for (var i = 0; i < e.clipboardData.items.length; i++) {
      var item = e.clipboardData.items[i];
      var file = item.getAsFile && item.getAsFile();

      if(file) {
	e.preventDefault();
	modifyTextArea(this.textarea, "[{s}" + file.type + "{s}]");
      };
    }
  };

  _handleOnChange = () => {
    autoresizeTextarea(this.textarea);
  };
}

export default FormMarkdownEdtiorField
