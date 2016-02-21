import React from 'react';
import classNames from 'classnames';
import MarkdownEditor from '../../lib/MarkdownEditor';
import AssetUploader from '../../lib/AssetUploader';
import autoresizeTextarea from '../../lib/autoresizeTextarea';

class FormMarkdownEdtiorField extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    rows: React.PropTypes.number
  };

  state = {
    draggingFile: false
  };

  componentDidMount() {
    this.markdownEditor = new MarkdownEditor(this.textarea);
    this.assetUploader = new AssetUploader({ onAssetUploaded: this._handleAssetUploaded, onError: this._handleAssetUploadError });

    autoresizeTextarea(this.textarea);
  }

  componentWillUnmount() {
    delete this.markdownEditor;
    delete this.assetUploader;
  }

  render() {
    let containerClasses = classNames({ "has-success": this.state.draggingFile });

    if(this.state.error) {
      var errorNode = (
        <div className="mt2 mb2 border border-red p2 red rounded clearfix">
          <div className="col" style={{position: "relative", top: "1px"}}>
            <i className="fa fa-warning mr2" />{this.state.error}
          </div>
          <div className="col-right">
            <button className="btn m0 p0" onClick={this._handleErrorDismissClick}><i className="fa fa-close"/></button>
          </div>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <div className="mb2">
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleBoldButtonClick}><i className="fa fa-bold"></i></button>
          <button className="btn btn-outline border-gray rounded mr3" onClick={this._handleItalicButtonClick}><i className="fa fa-italic"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleQuoteButtonClick}><i className="fa fa-quote-right"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleCodeButtonClick}><i className="fa fa-code"></i></button>
          <button className="btn btn-outline border-gray rounded mr3" onClick={this._handleLinkButtonClick}><i className="fa fa-link"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleBulletedListButtonClick}><i className="fa fa-list"></i></button>
          <button className="btn btn-outline border-gray rounded mr1" onClick={this._handleNumberedListButtonClick}><i className="fa fa-list-ol"></i></button>
        </div>
        {errorNode}
        <textarea
          id={this.props.id}
          name={this.props.name}
          placeholder={this.props.placeholder}
          defaultValue={this.props.value}
          rows={this.props.rows}
          onFocus={this._handleOnFocus}
          onBlur={this._handleOnBlur}
          onChange={this._handleOnChange}
          onPaste={this._handleOnPaste}
          onDragEnter={this._handleOnDragEnter}
          onDragOver={this._handleOnDragOver}
          onDragLeave={this._handleOnDragLeave}
          onDrop={this._handleOnDrop}
          ref={c => this.textarea = c}
          style={{overflowY: "hidden", resize: "vertical"}}
          className={"form-control"} />
      </div>
    );
  }

  _uploadFilesFromEvent(e) {
    var files = this.assetUploader.uploadFromEvent(e);

    // Were there any files uploaded in this event?
    if(files.length > 0) {
      // Since we've caught these files, we don't want the browser redirecting
      // to the file's location on the filesystem
      e.preventDefault();

      // Insert each of the files into the textarea
      files.forEach((file) => {
        let prefix = file.type.indexOf("image/") == 0 ? "!" : "";
        let text = prefix + "[Uploading " + file.name + "...]()";

        // If the input is currently in focus, insert the image where the users
        // cursor is.
        if(this.state.focused) {
          // If we're inserting the image at the end of a line with text, add a
          // new line before the insertion so it goes onto a new line.
          if(!this.markdownEditor.isCursorOnNewLine()) {
            text = "\n" + text;
          } else {
            text = text + "\n";
          }

          this.markdownEditor.insert(text);
        } else {
          // If there's something already in the textrea, add a new line and
          // add it to the bottom of the text.
          if(this.textarea.value.length > 0) {
            text = "\n" + text;
          }
          this.markdownEditor.append(text);
        }
      });

      // Since we've modified the textarea's value, we need to resize and focus
      // again.
      autoresizeTextarea(this.textarea);
      this.textarea.focus();
    }
  }

  _handleAssetUploaded = (file, url) => {
    // Replace the "uploading..." version of the file with the correct path
    this.markdownEditor.replace("[Uploading " + file.name + "...]()", "[" + file.name + "](" + url + ")")
  };

  _handleAssetUploadError = (exception) => {
    this.setState({ error: exception.message });
  };

  _handleErrorDismissClick = (e) => {
    e.preventDefault();

    this.setState({ error: null });
  };

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

  _handleOnDragEnter = (e) => {
    if(this.assetUploader.doesEventContainFiles(e)) {
      this.setState({ draggingFile: true });
    }
  };

  _handleOnDragOver = (e) => {
    // When you drag a file over a text area, the default browser behaviour
    // will show an insert caret at the cursor postition. Since there's no way
    // to get that caret, it doesn't make sense to show it, and then have to
    // insert the image at the end of the text area. So we'll just turn that
    // behaviour off.
    e.preventDefault();
  };

  _handleOnDragLeave = () => {
    // We don't really need to check if there were files in the drag, we can
    // just turn off the state.
    this.setState({ draggingFile: false });
  };

  _handleOnDrop = (e) => {
    // Drag leave won't fire on a drop, so we need to switch the state here
    // manually.
    this.setState({ draggingFile: false });

    this._uploadFilesFromEvent(e);
  };

  // Only available in Chrome
  _handleOnPaste = (e) => {
    this._uploadFilesFromEvent(e);
  };

  _handleOnChange = () => {
    autoresizeTextarea(this.textarea);
  };

  _handleOnFocus = () => {
    this.setState({ focused: true });
  };

  _handleOnBlur = () => {
    this.setState({ focused: false });
  };
}

export default FormMarkdownEdtiorField
