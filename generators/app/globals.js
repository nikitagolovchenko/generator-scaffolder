exports.PROMPTS_VALUES = {
  projectType: {
    markup: 'markup',
    markupCms: 'markupCms',
  },
  cms: {
    wp: 'wp',
    other: 'other',
  },
  framework: {
    none: false,
    bootstrap: 'bootstrap',
    zurb: 'zurb',
    materialize: 'materialize',
  },
  linters: {
    add: true,
    remove: false,
    css: 'css',
    js: 'js',
  }
};


exports.packages = {
  linters: {
    css: {
      scripts: {
        "lint:fix:css": "stylelint --fix \"src/**/*.{scss,sass}\" --config stylelint.config.js",
      },
    },
    js: {
      scripts: {
        "lint:fix:js": "eslint --fix \"src/**/*.{js,jsx}\" --config eslintrc.js --ignore-path .prettierignore",
      },
    },
  },
  frameworks: {
    bootstrap: {
      dependencies: {
        bootstrap: 'latest',
        'popper.js': 'latest'
      },
    },
    zurb: {
      dependencies: {
        'foundation-sites': 'latest',
        'what-input': 'latest'
      },
    },
    materialize: {
      dependencies: {
        'materialize-css': 'latest',
      },
    },
  },
};
