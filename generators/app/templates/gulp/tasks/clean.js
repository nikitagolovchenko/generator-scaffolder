const config = require('../gulpConfig');
const gulp = require('gulp');  
const del = require('del');
const chalk = require('chalk');
const deleteUnused = require('./util/watchDeletedFiles');

gulp.task('clean:rootfiles', () => {
    return del(config.dest.root + '/*.*').then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task('clean:fonts', () => {
  deleteUnused(config.src.fonts + '/**/*', config.dest.fonts + '/**/*');
});

gulp.task('clean:images', () => {
  deleteUnused(config.src.images + '/**/*', config.dest.images + '/**/*');
});

gulp.task('clean', [
    'clean:images',
    'clean:rootfiles',
    'clean:fonts'
]);

gulp.task('clean:watch', () => {
    gulp.watch(config.src.images + '/*', ['clean']);
});