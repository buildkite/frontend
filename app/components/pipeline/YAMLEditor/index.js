import React from 'react';
import ReactDOM from 'react-dom';
import CodeMirror from 'codemirror';

import jsyaml from 'js-yaml';

require("codemirror/mode/yaml/yaml");
require("codemirror/addon/lint/lint");
require("codemirror/addon/hint/show-hint");

// Our own YAML linter since the built-in requires jsyaml to be globally
// defined, which is a bit poo.
CodeMirror.registerHelper("lint", "yaml", function(text) {
  var found = [];

  try {
    jsyaml.load(text);
  }
  catch(e) {
    var loc = e.mark;

    found.push({
      from: CodeMirror.Pos(loc.line, loc.column),
      to: CodeMirror.Pos(loc.line, loc.column),
      message: e.message
    });
  }

  return found;
});

// Super basic hints for the editor
function getHints(cm, option) {
  let cursor = cm.getCursor(), line = cm.getLine(cursor.line);
  let start = cursor.ch, end = cursor.ch;

  return {
    list: [ "command", "block", "wait", "trigger" ],
    from: CodeMirror.Pos(cursor.line, start),
    to: CodeMirror.Pos(cursor.line, end)
  };
}

class YAMLEditor extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  };

  componentDidMount() {
    window.jsyaml = jsyaml;

    this.editor = new CodeMirror(ReactDOM.findDOMNode(this), {
      value: this.props.value || '',

      // Turn on line numbers
      lineNumbers: true,

      // Standard tab size
      tabSize: 2,

      // Enable YAML mode
      mode: 'yaml',

      // It's a bit weird to hide the cursor when highlighting text
      showCursorWhenSelecting: true,

      // Turn on linting
      lint: true,

      // Enable code complete
      hintOptions: { hint: getHints },

      // Include the lint marker column in the left gutter
      gutters: [ 'CodeMirror-lint-markers' ],

      extraKeys: {
        // Show the hint popup on various keyboard combos
        'Cmd-Space': () => { this.editor.showHint() },
        'Ctrl-Space': () => { this.editor.showHint() },
        'Alt-Space': () => { this.editor.showHint() },
        'Shify-Space': () => { this.editor.showHint() }
      }
    });

    this.editor.on('change', this.handleEditorChange);
    this.editor.on('keyup', this.handleEditorKeyUp);
  }

  componentWillUnmount() {
    window.jsyaml = null;

    this.editor.off('change', this.handleEditorChange);
    this.editor.off('keyup', this.handleEditorKeyUp);
    this.editor = null;
  }

  render() {
    return (
      <div></div>
    )
  }

  handleEditorChange = () => {
    this.props.onChange(this.editor.getValue());
  };

  handleEditorKeyUp = (cm, event) => {
    let code = event.keyCode;

    // Automatically trigger the autocomplete if the user hits the right keys
    if(code == 32) { // space
      let cursor = cm.getCursor(), line = cm.getLine(cursor.line);

      if(line.match(/^\s+-\s$/)) {
        this.editor.execCommand('autocomplete');
      }
    }
  };
}

export default YAMLEditor
