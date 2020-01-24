module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9,
    ecmaFeatures: {
      jsx: true,
      classes: true,
      modules: true
    }
  },
  plugins: ['react'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
  }
}