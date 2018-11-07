import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

import Spinner from 'app/components/shared/Spinner';

const CODEMIRROR_BUFFER = 8;
const CODEMIRROR_LINE_HEIGHT = 17;
const CODEMIRROR_MIN_HEIGHT = 150;

const CODEMIRROR_CONFIG = {
  lineNumbers: true,
  tabSize: 2,
  mode: 'yaml',
  keyMap: 'sublime',
  theme: 'yaml',
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
};

class FormYAMLEdtiorField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    CodeMirror: PropTypes.func
  };

  componentDidMount() {
    const { CodeMirror } = this.props;

    this.editor = CodeMirror.fromTextArea(
      this.input,
      CODEMIRROR_CONFIG
    );
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
}

const FormYAMLEdtiorFieldLoader = (props) => {
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
        <FormYAMLEdtiorField
          CodeMirror={loaded.CodeMirror}
          name={props.name}
          value={props.value}
        />
      );
    }
  });

  return (
    <LoadableCodeMirror {...props} />
  );
};

FormYAMLEdtiorFieldLoader.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string
};

export default FormYAMLEdtiorFieldLoader;
