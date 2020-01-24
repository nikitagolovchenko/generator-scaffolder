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
    general: {
      scripts: {
        "pretify:html": "prettier --check --write dist/*.html",
      },
      devDependencies: {
        "prettier": "^1.19.1",
        "prettier-loader": "^3.3.0",
      },
    },
    css: {
      scripts: {
        "lint:fix:css": "stylelint --fix src/styles/**/*.* -c stylelint.config.js",
      },
      devDependencies: {
        "stylelint": "^11.1.1",
        "stylelint-config-sass-guidelines": "^6.1.0",
        "stylelint-selector-bem-pattern": "^2.1.0",
        "stylelint-webpack-plugin": "^1.0.3",
      },
    },
    js: {
      scripts: {
        "lint:fix:js": "eslint --fix src/js/**/*.* -c eslintrc.js --ignore-path .prettierignore",
      },
      devDependencies: {
        "eslint": "^6.7.2",
        "eslint-config-airbnb-base": "^14.0.0",
        "eslint-config-prettier": "^6.7.0",
        "eslint-import-resolver-webpack": "^0.12.0",
        "eslint-loader": "^3.0.3",
        "eslint-plugin-import": "^2.19.1",
        "eslint-plugin-prettier": "^3.1.2",
      },
    },
  },
  frameworks: {
    bootstrap: {
      dependencies: {
        bootstrap: '^4.4.1',
        'popper.js': '^1.16.0'
      },
    },
    zurb: {
      dependencies: {
        'foundation-sites': '^6.6.1',
        'what-input': '^5.2.6'
      },
    },
    materialize: {
      dependencies: {
        'materialize-css': '^1.0.0',
      },
    },
  },
};
