module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-console': ['off'],
  },
};
