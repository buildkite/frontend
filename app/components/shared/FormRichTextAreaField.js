import React from 'react';
import MarkdownEditor from '../../lib/MarkdownEditor';

class FormRichTextAreaField extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    rows: React.PropTypes.number
  };

  componentDidMount() {
    this._resizeTextArea();
    this.markdownEditor = new MarkdownEditor(this.textarea);
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

  // Resizes the text area to be the same height as the text that's within it.
  // When you dynamically change the height of a text area, the browser scrolls
  // back to the top of the page, so we need to maintain it's scroll position
  // after the resize.
  _resizeTextArea() {
    let scrollLeft = window.pageXOffset ||
      (document.documentElement || document.body.parentNode || document.body).scrollLeft;

    let scrollTop  = window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

    let offsetHeight = this.textarea.offsetHeight;

    // Reset the style back to 0 so we can correctly calculate it's
    // scrollHeight (which will be the height of the text inside it)
    this.textarea.style.height = 0;

    let scrollHeight = this.textarea.scrollHeight;

    // If the new height will be more than it's previous height, expand it,
    // otherwise, just go back to the original one. There's a case where if the
    // user has manually adjusted the height of the text area, then it should
    // stay at the larger height.
    if(scrollHeight > offsetHeight) {
      this.textarea.style.height = scrollHeight + 'px';
    } else {
      this.textarea.style.height = offsetHeight + 'px';
    }

    window.scrollTo(scrollLeft, scrollTop);
  }

  _handleBoldButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.bold();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleItalicButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.italic();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleQuoteButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.quote();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleNumberedListButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.numberedList();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleBulletedListButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.bulletedList();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleCodeButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.code();
    this._resizeTextArea();
    this.textarea.focus();
  };

  _handleLinkButtonClick = (e) => {
    e.preventDefault();

    this.markdownEditor.link();
    this._resizeTextArea();
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
    this._resizeTextArea();
  };
}

export default FormRichTextAreaField
