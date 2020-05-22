# Projects scaffolding tool

**Project generator that contain various types of projects base structure:**
* Markup only
* Markup + CMS (Wordpress or another one)
* Markup + Frameworks (Bootstrap, Zurb Foudation, Materialize, Tailwind CSS)
* Markup + PUG (and/or frameworks, CMS)
* Markup + Twig (and/or frameworks, CMS)
... mix them up 👊

`CSS` preprocessor syntax is `SCSS`.

## Table of contents
- [Installation](#installation)
- [What's included](#whats-included)
- [How to use](#how-to-use)

## Installation

Generator is based on `Node JS` and `Yeoman` generator. First of all, you need to install them:

* [Node JS](https://nodejs.org/) - install latest recommended
* [Yeoman](https://yeoman.io/) - `npm install -g yo`

If you already have Node JS, then check version:
* `node -v` - **should be 10+. If your version is earlier than 10 - upgrade your Node JS**

Once you have Node JS and Yeoman installed, you ready to install generator itself.

Generator is an `npm` module, so you can easily install it using `npm` or `yarn`:

* `NPM` - run `npm i -g generator-p2h`
* `Yarn` - run `yarn global add generator-p2h`

## What's included

The main bundler for project is [Webpack](https://webpack.js.org/). All internal project logic is based on `Webpack` and local `config.json` file.

Depending on which options you choose while generating your projects, output features may vary:

#### Webpack

###### Always enabled:
- `Babel` - is a JavaScript ES6+ syntax transpiler, that give us an advantage of moders JS syntax features that is understandable for all browsers (IE11+)

###### Can be configured:
- `Eslint` - JavaScript syntax linter based on [airbnb config](https://www.npmjs.com/package/eslint-config-airbnb) and some custom options;
- `Stylelint` - SCSS syntax linter based on [SASS Guidelines](https://sass-guidelin.es/)

You can enable/disable those options when generating projects and in already generated project in `config.json` file.

#### Config file ⚙️
Internal configuration for project folder structure and some major features can be controlled using `config.json`.
The main idea behind this file is to control webpack behavior without webpack configuration change.

You can see default structure of this file: **`enable/disable` means `true/false`**

```
{
  "src": "src", // source files folder
  "dest": "dist", // production files folder
  "debug": false, // enable/disable debug mode
  "cache_boost": false, // enable/disable boost for generated CSS/JS bundles
  "minimize": true, // enable/disable CSS/JS minification
  "linters": {
    "css": true, // enable/disable Stylelint
    "js": true // enable/disable Eslint
  },
  "server": {
    "port": "3000", // redefine port for server
    "host": "localhost", // redefine host for server, e.g. my-site.test (if PHP server is used)
    "open": true // enable/disable automatic open of page in browser while running development mode
  },
  "styles": {
    "bundle": "style", // filename for main SCSS file
    "src": "styles", // source folder
    "dest": "css", // folder where to put compiled files, e.g to compile into project root (WP style), change to './'
    "extension": "scss" // file extension (SCSS only for now)
  },
  "scripts": {
    "bundle": "app", // filename for main JS file
    "src": "js", // source folder
    "dest": "js",  // folder where to put compiled files
    "extension": "js" // file extension
  },
  "templates": {
    "src": "views", // source folder for views
    "dest": "./", // where to compile (root of dest folder in this case)
    "extension": "html" // file extension
  },
  // static files object, this is all files that just copy/pasted from src to dest (with some postprocessing, for images in this case used imagemin)
  "static": {
    "fonts": {
      "src": "fonts", // folder name. By default dest === src, e.g. src/fonts === dist/fonts folder
      "dest": "fontsAwesomeFolder" // If you need another destination folder, just add this option (this is for showcase)
    },
    "images": {
      "src": "images"
    },
    "video": {
      "src": "video"
    },
    "ajax": {
      "src": "inc"
    }
  }
}
```
#### Features 🤩
  - Control input/output folders for files; control filenames, folder names etc. Make your own structure of project you need;
  - Control linters with one object (`linters: {}`);
  - Debug mode (`debug: true/false`) - review compiled code to remove/optimize your vendors using [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer);
  - Cache boost (`cache_boost: true/false`) - if enabled:
    - All JS/CSS/HTML get minified;
    - All JS and CSS files receive unique hash in HTML based on their content. (Enable browser caching for frontend without backend);
    - If JS file size is more than 240Kb - then all vendors are extracting into separate bundle, and `runtime.js` file is created.
    `runtime.js` file contains code that enables loading of your chunks. It loads created chunks via Jsonp. Since we have asked webpack to split chunks, we are now free to load any chunk any time. Hence for each chunk, webpack emit this `runtime.js` file so that it can handle requires correctly;
    - All those files are automatically added into HTML using HTMLWebpackPlugin;

- Stylelint - checking code style for SCSS 🔥 based on `stylelint.config.js` file;
- Prettier - format your files automatically 🔥  based on `prettier.config.js` file and `.editorconfig`;
- ES6+ newest syntax 🔥 Promises, Async/await, npm modules and more...

## How to use

All commands are listed in package.json file in scripts section and described below:

1.  **Generate project: `yo p2h`** - choose project settings you need. (**_if you already has project installed, skip this step_**)
2.  **Install project dependencies: `npm i` or `yarn`** - make sure your location is root of `markup` folder (**_if you already has modules installed, skip this step_**)
3.  **To run developmend mode, run: `npm run dev` or `yarn dev`** - running dev server, watching changes
4.  **To compile all assest into production mode, run: `npm run build` or `yarn build`** - build assets inro `dist` folder

**Additional utility scripts:**

1. **`npm run preview` or `yarn preview`** - run local webserver (to preview builded assets, for example)
1. **`npm run pretify:html` or `yarn pretify:html`** - using Prettier to pretify HTML files from `dist` folder (for example, if you don't need minified HTML files after build process and `minify` option set to `true`). Can be used only after compilation process.

**_Dont use `npm` and `yarn` in the same project - this can lead to unnexpected results_**


