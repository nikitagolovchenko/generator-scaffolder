# Webpack build for optimized load speed

## Features 🤩

- one file to control project - `config.json` 🔥:

  - Control input/output folders for for files, filenames, folder names etc. Make your own structure of project if you need (not tested yet :D );
  - different entries for different templates (with default index.html/index.js/main.scss)
  - enable/disable linters with one line (`linters: true/false`)
  - debug mode (`debug: true/false` bundle sizes/groups preview on production);
  - server settings (host and port - for backend based projects, where you need to proxy PHP server);

- automatic code splitting for JS
- common bundles between different entry files (index.js, about.js == common~index~about.js)
- gzip encoding while previewing project - to boost load speed (brotli is comming also)
- JS/CSS minification (critical CSS and removed unused CSS styles are incomming `critical_css: true/false`)
- Stylelint - checking coding style for SCSS 🔥 Configured on `stylelint.config.js` - based on SASS guidlines rules
- Prettier - format your files based on config automatically 🔥 - not mess with indentration, line widths, indentation widths etc. Based on `prettier.config.js` file and `.editorconfig`;
- ES6 / newest features🔥 - Promises, Async/await, Maps and MORE

## Requirements ⚙️

Node JS > 8
NPM/Yarn

## Usage 🤔

All commands are listed in package.json file in scripts section and described below:

### To install all dependencies run `npm i` or `yarn`

##### Dont use npm and yarn in same project - this can lead to unnexpected results

### Dev mode `npm dev` or `npm run dev` or `yarn dev`

  - remove `dist` folder
  - build assets in development mode
  - running dev server
  - watching changes

### Production mode `npm build` or `npm run build` or `yarn build`

  - remove `dist` folder
  - build assets in production mode into `dist` folder


### Utility scripts

 - `npm lint:fix` - running Stylelint fix of common issues in SCSS files. Not all of issues can be solved automatically. Good to use when you have a lot of issues with indentation (lint-staged is comming - checking codestyled in every git push. Perfect for GIT flow)

 - `npm run preview` - running local server to preview builded files - has a benefit of GZIP encoding 🔥 that can increase loading speed in times.



