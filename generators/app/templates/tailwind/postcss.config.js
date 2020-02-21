module.exports = ({options, env}) => ({
  plugins: {
    'postcss-preset-env': true,
    'tailwindcss': true,
    cssnano: options.cssnano && env === 'production' ? {} : false,
    perfectionist: options.cssnano && env === 'production' ? false : {
      cascade: false,
      colorShorthand: false,
      indentSize: 2,
      maxSelectorLength: false,
      maxAtRuleLength: false,
      maxValueLength: false,
    },
  },
});
