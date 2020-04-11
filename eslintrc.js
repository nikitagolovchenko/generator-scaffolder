module.exports = {
  env: {
    node: true,
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
