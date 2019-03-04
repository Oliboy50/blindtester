module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2019,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
      { allowTemplateLiterals: true },
    ],
    semi: [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
  },
  overrides: [
    {
      files: ['*.test.js', '*.e2e-test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
