import CodeMirror from 'codemirror';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'app/css/codemirror.css';

CodeMirror.defineSimpleMode("conditional", {
  // The start state contains the rules that are intially used
  start: [
    { regex: /^\/\/.*/, token: "comment" },
    { regex: /["'](?:[^\\]|\\.)*?(?:["']|$)/, token: "string" },
    { regex: /[\/](?:[^\\]|\\.)+(?:[\/])/, token: "regex" },
    { regex: /env/, token: "keyword" },
    { regex: /[\(\)]/, token: "punctuation" },
    { regex: /[!=~%|&]+/, token: "operator" },
    { regex: /[a-zA-Z0-9_]+/, token: "string" },
  ],

  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});

export default CodeMirror;
