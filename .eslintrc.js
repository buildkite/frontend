const schemaJson = require('./app/graph/schema.json');

const ERROR = 'error';
const WARN = 'warn';
const OFF = 'off';

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:import/react',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended'
  ],
  globals: {
    require: true,
    Features: true,
    process: true,
    Stripe: true
  },
  env: {
    es6: true,
    browser: true
  },
  plugins: [
    'import',
    'react',
    'flowtype',
    'relay',
    'graphql'
  ],
  settings: {
    react: {
      version: "16.6",
      flowVersion: "0.84"
    }
  },
  rules: {
  'array-bracket-spacing': [ ERROR, 'never' ],
    'arrow-parens': WARN,
    'arrow-spacing': WARN,
    'brace-style': [ ERROR, '1tbs', { allowSingleLine: true } ],
    'comma-dangle': [ ERROR, 'never' ],
    'comma-spacing': ERROR,
    'comma-style': [ ERROR, 'last' ],
    'curly': [ ERROR, 'all' ],
    'eqeqeq': [ ERROR, 'smart' ],
    'id-length': ERROR,
    'indent': [ ERROR, 2, { SwitchCase: 1, MemberExpression: 1, FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } } ],
    'jsx-quotes': ERROR,
    'key-spacing': ERROR,
    'keyword-spacing': ERROR,
    'linebreak-style': ERROR,
    'no-const-assign': ERROR,
    'no-duplicate-imports': ERROR,
    'no-else-return': WARN,
    'no-eval': ERROR,
    'no-implied-eval': ERROR,
    'no-multi-spaces': ERROR,
    'no-new-require': ERROR,
    'no-trailing-spaces': ERROR,
    'no-unsafe-negation': ERROR,
    'no-unused-vars': [ ERROR, { varsIgnorePattern: '^_' } ],
    'no-useless-rename': WARN,
    'no-var': WARN,
    'object-curly-spacing': [ ERROR, 'always' ],
    'one-var': [ ERROR, { initialized: 'never' } ],
    'one-var-declaration-per-line': ERROR,
    'prefer-const': WARN,
    'radix': WARN,
    'semi': ERROR,
    'semi-spacing': ERROR,
    'space-before-function-paren': [ ERROR, 'never' ],
    'space-in-parens': [ ERROR, 'never' ],
    'space-infix-ops': ERROR,
    'space-unary-ops': ERROR,
    'strict': ERROR,
    'unicode-bom': ERROR,

    'flowtype/delimiter-dangle': ERROR,
    'flowtype/no-dupe-keys': ERROR,
    'flowtype/no-primitive-constructor-types': ERROR,
    'flowtype/object-type-delimiter': ERROR,
    'flowtype/require-valid-file-annotation': ERROR,
    'flowtype/semi': ERROR,

    'import/extensions': [ERROR, "never", {"css": "always"}],
    'import/unambiguous': OFF,
    'import/no-unresolved': OFF, // Handled by Flow.

    'react/display-name': [ ERROR, { ignoreTranspilerName: false } ],
    'react/forbid-prop-types': OFF,
    'react/jsx-boolean-value': [ ERROR, 'always' ],
    'react/jsx-closing-bracket-location': ERROR,
    'react/jsx-curly-spacing': ERROR,
    'react/jsx-equals-spacing': [ ERROR, 'never' ],
    'react/jsx-first-prop-new-line': [ ERROR, 'multiline' ],
    'react/jsx-handler-names': ERROR,
    'react/jsx-indent': [ ERROR, 2 ],
    'react/jsx-indent-props': [ ERROR, 2 ],
    'react/jsx-key': ERROR,
    'react/jsx-max-props-per-line': [ ERROR, { when: 'multiline' } ],
    'react/jsx-no-bind': [ WARN, { ignoreRefs: true } ],
    'react/jsx-no-comment-textnodes': ERROR,
    'react/jsx-no-duplicate-props': ERROR,
    'react/jsx-no-literals': OFF,
    'react/jsx-no-target-blank': ERROR,
    'react/jsx-no-undef': ERROR,
    'react/jsx-pascal-case': ERROR,
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-sort-props': OFF,
    'react/jsx-uses-react': ERROR,
    'react/jsx-uses-vars': ERROR,
    'react/jsx-wrap-multilines': ERROR,
    'react/no-array-index-key': WARN,
    'react/no-danger': OFF,
    'react/no-danger-with-children': ERROR,
    'react/no-deprecated': ERROR,
    'react/no-did-mount-set-state': ERROR,
    'react/no-did-update-set-state': ERROR,
    'react/no-direct-mutation-state': ERROR,
    'react/no-is-mounted': ERROR,
    'react/no-multi-comp': [ ERROR, { ignoreStateless: true } ],
    'react/no-set-state': OFF,
    'react/no-string-refs': ERROR,
    'react/no-unescaped-entities': ERROR,
    'react/no-unknown-property': ERROR,
    'react/no-unused-prop-types': ERROR,
    'react/prefer-es6-class': ERROR,
    'react/prefer-stateless-function': OFF,
    'react/prop-types': ERROR,
    'react/react-in-jsx-scope': ERROR,
    'react/require-optimization': ERROR,
    'react/require-render-return': ERROR,
    'react/self-closing-comp': WARN,
    'react/sort-comp': OFF,
    'react/style-prop-object': WARN,
    'react/jsx-tag-spacing': ERROR,
    'react/void-dom-elements-no-children': ERROR,

    'relay/graphql-syntax': ERROR,
    'relay/compat-uses-vars': WARN,
    'relay/graphql-naming': ERROR,
    'relay/generated-flow-types': WARN,
    'relay/no-future-added-value': WARN,
    'relay/unused-fields': WARN,

    'graphql/named-operations': [ WARN, { env: 'relay', schemaJson } ],
    'graphql/no-deprecated-fields': [ ERROR, { env: 'relay', schemaJson } ],
    // Disabled for now — it’s just a bit too noisy.
    // 'graphql/template-strings': [ WARN, { env: 'relay', validators: 'all', schemaJson } ]
  }
};
