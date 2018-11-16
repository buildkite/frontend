import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

import Spinner from 'app/components/shared/Spinner';

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

class FormConditionEdtiorField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    CodeMirror: PropTypes.func
  };

  componentDidMount() {
    const { CodeMirror } = this.props;

    const config = {
      ...CODEMIRROR_CONFIG,
      hintOptions: {
        closeOnUnfocus: false,
        completeSingle: false,
        "hint": (cm, options) => {
          return new Promise((accept) => {
            let cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            let start = cursor.ch, end = cursor.ch
            while (start && /\w/.test(line.charAt(start - 1))) --start
            while (end < line.length && /\w/.test(line.charAt(end))) ++end
            var word = line.slice(start, end).toLowerCase();

            if (word.length < 2) {
              return accept(null);
            }

            var suggestions = [];
            for (var i = 0; i < this.props.autocompleteWords.length; i++) {
              if (this.props.autocompleteWords[i].toLowerCase().indexOf(word) != -1) {
                suggestions.push({
                  text: this.props.autocompleteWords[i],
                  render: (el, self, data) => {
                    var labelElement = document.createElement("DIV");
                    labelElement.className = "monospace";
                    labelElement.appendChild(document.createTextNode(data.text));

                    var descriptionElement = document.createElement("DIV");
                    descriptionElement.className = "system dark-gray";
                    descriptionElement.appendChild(document.createTextNode("Very important information"));

                    var suggestionElement = document.createElement("DIV");
                    suggestionElement.appendChild(labelElement);
                    suggestionElement.appendChild(descriptionElement);

                    el.appendChild(suggestionElement);
                  }
                });
              }
            }

            if (suggestions.length) {
              return accept({
                list: suggestions,
                from: CodeMirror.Pos(cursor.line, start),
                to: CodeMirror.Pos(cursor.line, end)
              });
            } else {
              return accept(null);
            }
          });
        }
      },
      lint: {
        "getAnnotations": (text, updateLinting, options, cm) => {
          this.props.fetchParseErrors(text, (parseErrors) => {
            let collected = [];
            for(let e of parseErrors) {
              collected.push({
                from: CodeMirror.Pos(e.from[0] - 1, e.from[1] - 1),
                to: CodeMirror.Pos(e.to[0] - 1, e.to[1] - 1),
                message: e.message
              });
            }
            updateLinting(collected);
          });
        },
        "async": true
      }
    }

    this.editor = CodeMirror.fromTextArea(this.input, config);
    this.editor.on("keyup", this.onEditorKeyUp);
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

const FormConditionEdtiorFieldLoader = (props) => {
  // Here's a dynamic loader for editor that does some magical stuff. It tries
  // to attempt the size of the editor before we load it, this way the page
  // doesn't change in size after we load in Codemirror.
  const ApproximateHeightLoader = (loader) => {
    let contents;
    if (loader.error) {
      contents = (
        <span className="red">
          There was an error loading the editor. Please reload the page.
        </span>
      );
    } else if (loader.pastDelay) {
      contents = (
        <span>
          <Spinner /> Loading Editor…
        </span>
      );
    } else {
      contents = null;
    }

    const lines = props.value.split("\n").length;
    let height = CODEMIRROR_BUFFER + (lines * CODEMIRROR_LINE_HEIGHT);
    if (CODEMIRROR_MIN_HEIGHT > height) {
      height = CODEMIRROR_MIN_HEIGHT;
    }

    return (
      <div className="flex items-center justify-center" style={{ height: height }}>
        {contents}
      </div>
    );
  };

  ApproximateHeightLoader.propTypes = {
    value: PropTypes.string
  };

  // This loads Codemirror and all of its addons.
  const LoadableCodeMirror = Loadable.Map({
    loader: {
      CodeMirror: () => (
        import('./codemirror').then((module) => (
          // HACK: Add a "zero" delay after the module has
          // loaded, to allow their styles to take effect
          new Promise((resolve) => {
            setTimeout(() => resolve(module.default), 0);
          })
        ))
      )
    },

    loading() {
      return (
        <ApproximateHeightLoader />
      );
    },

    render(loaded, props) {
      return (
        <FormConditionEdtiorField
          CodeMirror={loaded.CodeMirror}
          name={props.name}
          value={props.value}
          fetchParseErrors={props.fetchParseErrors}
          autocompleteWords={props.autocompleteWords}
        />
      );
    }
  });

  return (
    <LoadableCodeMirror {...props} />
  );
};

FormConditionEdtiorFieldLoader.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string
};

export default FormConditionEdtiorFieldLoader;
