import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

import Spinner from '../Spinner';

class FormYAMLEdtiorField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    CodeMirror: PropTypes.func
  };

  componentDidMount() {
    this.editor = this.props.CodeMirror.fromTextArea(this._input, {
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
      <div className="buildkite-codemirror">
        <textarea name={this.props.name} defaultValue={this.props.value} ref={(node) => { this._input = node; }} />
      </div>
    );
  }
}

const CODEMIRROR_BUFFER = 8;
const CODEMIRROR_LINE_HEIGHT = 18;

export default function(props) {
  // Here's a dynamic loader for editor that does some magical stuff. It tries
  // to attempt the size of the editor before we load it, this way the page
  // doesn't change in size after we load in Codemirror.
  const ApproximateHeightLoader = function(loader) {
    const lines = props.value.split("\n").length;
    const height = CODEMIRROR_BUFFER + (lines * CODEMIRROR_LINE_HEIGHT);

    return (
      <div className="flex items-center justify-center" style={{ height: height }}>
        <Spinner /> Loading Editor…
      </div>
    );
  };

  // This loads Codemirror and all of its addons.
  const LoadableCodeMirror = Loadable.Map({
    loader: {
      CodeMirror: () => import('./codemirror')
    },

    loading(props) {
      return (
        <ApproximateHeightLoader {...props} />
      );
    },

    render(loaded, props) {
      return (
        <FormYAMLEdtiorField CodeMirror={loaded.CodeMirror} name={props.name} value={props.value} />
      );
    }
  });

  return (
    <LoadableCodeMirror {...props} />
  );
}
