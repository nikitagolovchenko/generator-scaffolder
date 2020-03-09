# Webpack build for optimized load speed

## Features 🤩

- one file to control project - `config.json` 🔥:

  - Control input/output folders for for files, filenames, folder names etc. Make your own structure of project if you need;
  - enable/disable linters with one line (`linters: {css: true/false, js: true/false}`)
  - debug mode (`debug: true/false` bundle sizes/groups preview on production);
  - critical CSS (`critical_css: true/false` inline styles into head);
  - cache boost (`cache_boost: true/false` if enabled - all JS/CSS/HTML get minified, all JS and CSS files receive unique hash in HTML based on their content). Enable browser caching for frontend without backend;
  - server settings (host and port - for backend based projects, where you need to proxy PHP server);

- automatic code splitting for JS
- gzip encoding while previewing project - to boost load speed (brotli is comming also)
- Stylelint - checking coding style for SCSS 🔥 Configured on `stylelint.config.js` - based on SASS guidlines rules
- Prettier - format your files based on config automatically 🔥 - not mess with indentration, line widths, indentation widths etc. Based on `prettier.config.js` file and `.editorconfig`;
- ES6 / newest features🔥 - Promises, Async/await, Maps and MORE

## Requirements ⚙️

Node JS > 8
NPM/Yarn
yeoman - `npm i -g yo`

## Usage 🤔

All commands are listed in package.json file in scripts section and described below:

### To install all dependencies run `npm i` or `yarn`

##### Dont use npm and yarn in same project - this can lead to unnexpected results

### Dev mode `npm run dev` or `yarn dev`

  - build assets in development mode
  - running dev server
  - watching changes

### Production mode `npm run build` or `yarn build`

  - build assets in production mode into `dist` folder


### Utility scripts

 - `npm pretify:html` - uses Prettier to pretify HTML fiels output (if you don't need minified HTML file, but want to use minified JS). Should be used only after compilation process.

 - `npm run preview` - running local server to preview builded files - has a benefit of GZIP encoding 🔥 that can increase loading speed in times.


