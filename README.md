# generator-p2h [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Build for common types of projects using gulp, webpack

## Installation

```bash
npm install -g yo
npm install -g generator-p2h
```

Then generate your new project in the new folder:

```bash
yo p2h
```

## How to use:

- Install [Node JS](https://nodejs.org) on your local machine, recommended version should be used (minimal version is 8)

- Install [GULP Js](https://gulpjs.com/) globally

```bash
npm install gulp-cli -g
```

- Install [NPM](https://www.npmjs.com/get-npm) globally on your local machine - it could be installed with NODE JS. To check if you have it installed type in the terminal

```bash
npm -v
```

- From the folder `markup` open terminal/command prompt

- To install all project dependencies type

```bash
npm i
```

- Available commands:

  - `gulp` - this will compile the entire project into development mode, start browserSync on localhost and will watch all the changes to the SCSS, html, images etc.
  - `gulp dist`- this is used to compile project assets into production.

  - Additional commands for CSS compilation:

    - `gulp compact` - [compact output style](https://github.com/sass/node-sass#outputstyle) for CSS
    - `gulp compressed` - [compressed output style](https://github.com/sass/node-sass#outputstyle) for CSS
    - `gulp nested` - [nested output style](https://github.com/sass/node-sass#outputstyle) for CSS

  - **_NOTE:_** by default - we have an [extended](https://github.com/sass/node-sass#outputstyle) version of compiled CSS both in dev and prod mode.

### Dev tips:

- While developing - try not to push a dist folder to the repository, to prevent additional conflicts.

### **IMPORTANT:**

If you are facing some troubles while installing build on your machine, please make sure that you have a correct version of the NODE JS.
To check the version - open terminal and type: `node -v` . It should be 10+ (maybe 8 is okay, but 6 is old, there is no support for node 6 in some modules that are used).

## Getting To Know Yeoman

- Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [P2H](https://www.p2h.com/)

[npm-image]: https://badge.fury.io/js/generator-p2h.svg
[npm-url]: https://npmjs.org/package/generator-p2h
[travis-image]: https://travis-ci.org/mrlss/generator-p2h.svg?branch=master
[travis-url]: https://travis-ci.org/mrlss/generator-p2h
[daviddm-image]: https://david-dm.org/mrlss/generator-p2h.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mrlss/generator-p2h
