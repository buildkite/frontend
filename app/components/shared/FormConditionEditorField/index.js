// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

import Spinner from 'app/components/shared/Spinner';

type CodeMirrorInstance = {
  showHint: ({}) => void,
  on: (string, (...any) => void) => mixed,
  off: (string, (...any) => void) => mixed,
  getValue: () => string,
  execCommand: (string) => void,
  toTextArea: () => HTMLTextAreaElement
};

const CODEMIRROR_BUFFER = 8;
const CODEMIRROR_LINE_HEIGHT = 17;
const CODEMIRROR_MIN_HEIGHT = CODEMIRROR_BUFFER + CODEMIRROR_LINE_HEIGHT;

const CODEMIRROR_CONFIG = {
  lineNumbers: true,
  tabSize: 2,
  mode: 'conditional',
  keyMap: 'sublime',
  theme: 'conditional',
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  viewportMargin: Infinity,
  gutters: ['CodeMirror-linenumbers'],
  extraKeys: {
    'Ctrl-Left': 'goSubwordLeft',
    'Ctrl-Right': 'goSubwordRight',
    'Alt-Left': 'goGroupLeft',
    'Alt-Right': 'goGroupRight',
    'Cmd-Space': (cm) => cm.showHint({ completeSingle: true }),
    'Ctrl-Space': (cm) => cm.showHint({ completeSingle: true }),
    'Alt-Space': (cm) => cm.showHint({ completeSingle: true })
  }
};

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z_]$/;

type Props = {
  name: string,
  value: string,
  autocompleteWords: Array<string>,
  fetchParseErrors: (string, (Array<{ from: Array<number>, to: Array<number>, message: string }>) => void) => void,
  CodeMirror: CodeMirror
};

type CodeMirror = {
  fromTextArea: (HTMLTextAreaElement, {}) => CodeMirrorInstance,
  Pos: (number, number) => number
};

type ReactLoadableLoadingProps = {
  value: string,
  error?: string,
  pastDelay?: boolean
};

class FormConditionEdtiorField extends React.Component<Props> {
  editor: ?CodeMirrorInstance
  input: ?HTMLTextAreaElement

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    autocompleteWords: PropTypes.array,
    CodeMirror: PropTypes.func
  };

  componentDidMount() {
    const { CodeMirror } = this.props;

    const config = {
      ...CODEMIRROR_CONFIG,
      hintOptions: {
        closeOnUnfocus: false,
        completeSingle: false,
        "hint": (cm, _options) => {
          return new Promise((accept) => {
            const cursor = cm.getCursor();
            const line = cm.getLine(cursor.line);
            let start = cursor.ch;
            let end = cursor.ch;
            while (start && /\w/.test(line.charAt(start - 1))) { --start; }
            while (end < line.length && /\w/.test(line.charAt(end))) { ++end; }
            const word = line.slice(start, end).toLowerCase();

            if (word.length < 2) {
              return accept(null);
            }

            const suggestions = [];
            for (const candidate of this.props.autocompleteWords) {
              if (candidate.toLowerCase().indexOf(word) !== -1) {
                suggestions.push({
                  text: candidate,
                  render: (el, self, data) => {
                    const labelElement = document.createElement("DIV");
                    labelElement.className = "monospace";
                    labelElement.appendChild(document.createTextNode(data.text));

                    const descriptionElement = document.createElement("DIV");
                    descriptionElement.className = "system dark-gray";
                    descriptionElement.appendChild(document.createTextNode("Very important information"));

                    const suggestionElement = document.createElement("DIV");
                    suggestionElement.appendChild(labelElement);
                    suggestionElement.appendChild(descriptionElement);

                    el.appendChild(suggestionElement);
                  }
                });
              }
            }

            if (suggestions.length === 0) {
              return accept(null);
            }

            return accept({
              list: suggestions,
              from: CodeMirror.Pos(cursor.line, start),
              to: CodeMirror.Pos(cursor.line, end)
            });
          });
        }
      },
      lint: {
        "getAnnotations": (text, updateLinting, _options, _cm) => {
          this.props.fetchParseErrors(text, (parseErrors) => {
            const collected = [];
            for (const err of parseErrors) {
              collected.push({
                from: CodeMirror.Pos(err.from[0] - 1, err.from[1] - 1),
                to: CodeMirror.Pos(err.to[0] - 1, err.to[1] - 1),
                message: err.message
              });
            }
            updateLinting(collected);
          });
        },
        "async": true
      }
    };

    if (this.input) {
      this.editor = CodeMirror.fromTextArea(this.input, config);
      this.editor.on("keyup", this.onEditorKeyUp);
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.toTextArea();
      delete this.editor;
    }
  }

  render() {
    return (
      <div style={{ minHeight: CODEMIRROR_MIN_HEIGHT }}>
        <textarea
          name={this.props.name}
          defaultValue={this.props.value}
          ref={(input) => this.input = input}
        />
      </div>
    );
  }

  onEditorKeyUp = (codeMirrorInstance: CodeMirrorInstance, event: { key: string }) => {
    if (AUTO_COMPLETE_AFTER_KEY.test(event.key) || event.key === "Backspace") {
      codeMirrorInstance.execCommand('autocomplete');
    }
  };
}

// Instead of exporting the editor directly, we'll export a `Loadable`
// Component that will allow us to load in dependencies and render the editor
// until then.
export default Loadable({
  loader: () => (
    import('./codemirror').then((module) => (
      // Add a "zero" delay after the module has loaded, to allow their
      // styles to take effect.
      new Promise((resolve) => {
        setTimeout(() => resolve(module.default), 0);
      })
    ))
  ),

  loading(loadable: ReactLoadableLoadingProps) {
    if (loadable.error) {
      return (
        <div className="red">{loadable.error}</div>
      );
    } else if (loadable.pastDelay) {
      //const lines = loadable.value.split("\n").length;
      //let height = CODEMIRROR_BUFFER + (lines * CODEMIRROR_LINE_HEIGHT);
      //if (CODEMIRROR_MIN_HEIGHT > height) {
      const height = CODEMIRROR_MIN_HEIGHT;
      //}

      return (
        <div className="flex items-center justify-center" style={{ height: height }}>
          <Spinner /> Loading Editor…
        </div>
      );
    }

    return null;
  },

  /* eslint-disable react/prop-types */
  render(loaded: CodeMirror, props: Props) {
    return (
      <FormConditionEdtiorField
        CodeMirror={loaded}
        name={props.name}
        value={props.value}
        fetchParseErrors={props.fetchParseErrors}
        autocompleteWords={props.autocompleteWords}
      />
    );
  }
});
