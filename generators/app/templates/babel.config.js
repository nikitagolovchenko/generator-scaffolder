module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": "core-js@2",
      "targets": {
        "browsers": [
          "Edge >= 14",
          "Chrome >= 60",
          "Firefox >= 55",
          "ie >= 11",
          "Safari >= 10",
          "iOS >= 10"
        ]
      }
    }]
  ];

  const plugins = [
    ["@babel/plugin-syntax-dynamic-import"]
  ]

  return {
    presets,
    plugins
  };
}
