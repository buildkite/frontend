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
    { regex: /\/\/.*/, token: "comment" },
    { regex: /'(?:[^\\']|\\.)*?(?:'|$)/, token: "string" },
    { regex: /"/, token: "string", push: "quotestring" },
    { regex: /\/(?:[^\\/]|\\.)+\/[a-z]*/, token: "regex" },
    { regex: /[().,]/, token: "punctuation" },
    { regex: /[!=~%|&]+/, token: "operator" },
    { regex: /[a-zA-Z_][a-zA-Z0-9_]*/, token: "variable" },
    { regex: /[0-9]+(?:\.[0-9]+)?/, token: "number" },
    { regex: /\$[a-zA-Z_][a-zA-Z0-9_]*/, token: "variable-2" },
    { regex: /\$\{/, token: "variable-3", push: "shellbrace" },
  ],

  quotestring: [
    { regex: /"/, token: "string", pop: true },
    { regex: /\$[a-zA-Z_][a-zA-Z0-9_]*/, token: "variable-2" },
    { regex: /\$\{/, token: "variable-3", push: "shellbrace" },
    { regex: /\$\$|\\[0-7]{1,3}|\\x[0-9a-fA-F]{2}|\\./, token: "string-2" },
    { regex: /[^"$\\]+|./, token: "string" },
  ],

  shellbrace: [
    { regex: /\}/, token: "variable-3", pop: true },
    { regex: /:?[+-]/, token: "variable-3", next: "shellstring" },
    { regex: /[:?]/, token: "variable-3" },
    { regex: /[0-9]+/, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z0-9_]*/, token: "variable-2" },
  ],

  shellstring: [
    { regex: /\}/, token: "variable-3", pop: true },
    { regex: /\$[a-zA-Z_][a-zA-Z0-9_]*/, token: "variable-2" },
    { regex: /\$\{/, token: "variable-3", push: "shellbrace" },
    { regex: /'(?:[^\\']|\\.)*?(?:'|$)/, token: "string" },
    { regex: /"/, token: "string", push: "quotestring" },
    { regex: /\$\$|\\[0-7]{1,3}|\\x[0-9a-fA-F]{2}|\\./, token: "string-2" },
    { regex: /[^"'$\\}]+|./, token: "string-3" },
  ],

  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});

export default CodeMirror;
