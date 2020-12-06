module.exports = {
  parser: 'babel-eslint',
  ignorePatterns: ['**/lib'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    'ramda',
    'sonarjs',
  ],
  //    "extends": "eslint:recommended",
  extends: [
    'airbnb',
    'plugin:ramda/recommended',
  ],
  rules: {
    //        "one-var": ["error", "never"],
    //        "one-var-declaration-per-line": ["error", "initializations"],
    'no-use-before-define': ['error', { variables: false, functions: false }],
    // "comma-dangle": "off",
    // "one-var": "off",
    // "strict": "off",

    // "spaced-comment": "off",
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    // "func-names": "off",
    'func-names': ['warn', 'never'],
    'max-len': ['error', { code: 200, tabWidth: 2, ignoreStrings: true }],
    // "max-len": ["error",  { "code": 120, "tabWidth": 4, "ignoreStrings": true }],
    // "one-var-declaration-per-line": "off",
    // "prefer-destructuring": ["error", {
    //     "array": false,
    //     "object": true
    // }],
    'no-param-reassign': 'off',
    'no-return-assign': ['error', 'except-parens'],
    // "no-console": "off",
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'warn',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],

    // complexity rules
    complexity: ['error', { max: 20 }],
    'max-lines-per-function': [
      'error', {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-depth': ['error', 3],

    // this rule is deprecated https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    // 'react/jsx-filename-extension': 'off',
    // 'react/jsx-one-expression-per-line':'off',
    // 'react/state-in-constructor': 'off',
    'react/prop-types': 'off',
    'react/static-property-placement': ['error', 'static public field', {
      propTypes: 'static public field',
    }],
    'react/destructuring-assignment': ['error', 'always', { ignoreClassFields: true }],

    'import/prefer-default-export': 'off',
    'import/named': 'error',
    'import/no-default-export': 'error',
    // "import/no-unresolved": "off",
    'import/extensions': [
      'error',
      'never',
      {
        jsx: 'always',
        json: 'always',
        css: 'always',
      },
    ],
    'react/sort-comp': 'off',
  },
};
