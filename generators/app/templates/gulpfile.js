'use strict';
const config = require('./gulp/config');

config.baseDir = __dirname;

// Require all tasks in gulp/tasks, including subfolders
require('require-dir')('./gulp/tasks', {recurse: true});
