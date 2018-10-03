// TODO: stylelint

const plumber = require('gulp-plumber');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const gulpif = require('gulp-if');
const browserSync = require('./browserSync');
const config = require('../config');

const processors = [
  autoprefixer({
    cascade: false,
    browsers: ['last 4 versions']
  }),
  mqpacker({
    sort: true
  })
];

gulp.task('sass', () =>
  gulp
    .src([`${config.src.sass}/*.{scss,sass}`])
    .pipe(
      plumber({
        handleError: err => {
          // eslint-disable-next-line no-console
          console.log(err);
          this.emit('end');
        }
      })
    )
    .pipe(
      sass({
        outputStyle: config.production() ? 'compressed' : 'expanded'
      })
    )
    .pipe(postcss(processors))
    .pipe(gulpif(config.development(), sourcemaps.init()))
    .pipe(gulpif(config.development(), sourcemaps.write()))
    .pipe(gulp.dest(config.dest.css))
);

gulp.task('sass:watch', () => {
  gulp.watch(`${config.src.sass}/**/*.{scss,sass}`, ['sass']).on('change', browserSync.reload);
});
