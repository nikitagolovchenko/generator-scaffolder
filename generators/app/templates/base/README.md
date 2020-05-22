# Webpack build for optimized load speed

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

1.  **Install project dependencies: `npm i` or `yarn`** - make sure your location is root of `markup` folder (**_if you already has modules installed, skip this step_**)
2.  **To run developmend mode, run: `npm run dev` or `yarn dev`** - running dev server, watching changes
3.  **To compile all assest into production mode, run: `npm run build` or `yarn build`** - build assets intro `dist` folder

**Additional utility scripts:**

1. **`npm run preview` or `yarn preview`** - run local webserver (to preview builded assets, for example)
2. **`npm run pretify:html` or `yarn pretify:html`** - uses Prettier to pretify HTML files from `dist` folder (for example, if you don't need minified HTML files after build process and `minify` option set to `true`). Can be used only after compilation process.

**_Dont use `npm` and `yarn` in the same project - this can lead to unnexpected results_**
