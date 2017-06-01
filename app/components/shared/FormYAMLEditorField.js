import React from 'react';
import PropTypes from 'prop-types';
import reffer from 'reffer';

class FormYAMLEdtiorField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string
  };

  componentDidMount() {
    const CodeMirror = require('codemirror');
    require('codemirror/addon/hint/show-hint');
    require('codemirror/addon/comment/comment');
    require('codemirror/addon/edit/matchbrackets');
    require('codemirror/addon/edit/closebrackets');
    require('codemirror/addon/lint/lint');
    require('codemirror/keymap/sublime');
    require('codemirror/mode/yaml/yaml');

    this.editor = CodeMirror.fromTextArea(this._textarea, {
      lineNumbers: true,
      tabSize: 2,
      mode: 'yaml',
      keyMap: 'sublime',
      // theme: 'neo',
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      viewportMargin: Infinity,
      gutters: ['CodeMirror-linenumbers'],
      extraKeys: {
        'Ctrl-Left': 'goSubwordLeft',
        'Ctrl-Right': 'goSubwordRight',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight'
      }
    });
  }

  render() {
    return (
      <div>
        <textarea name={this.props.name} value={this.props.value} ref={this::reffer('_textarea')} />
      </div>
    );
  }
}

export default FormYAMLEdtiorField;
