'use strict';

const config = require('../config');
const gulp = require('gulp');
const changed = require('gulp-changed');

gulp.task('copy:rootfiles', () => {
  return gulp.src(config.src.root + '/*.*').pipe(gulp.dest(config.dest.root));
});

gulp.task('copy:fonts', () => {
  return gulp.src(config.src.fonts + '/**/*.{ttf,svg,eot,woff,woff2}').pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:images', () => {
  return gulp.src([config.src.images + '/**/*.{jpg,png,jpeg,svg,gif}']).pipe(gulp.dest(config.dest.images));
});

gulp.task('copy:video', () => {
  return gulp.src([config.src.video + '/**/*.{mp4,webm}']).pipe(gulp.dest(config.dest.video));
});

gulp.task('copy:ajaxIncludes', () => {
  return gulp.src(config.src.ajaxIncludes + '/*.*').pipe(gulp.dest(config.dest.ajaxIncludes));
});

gulp.task('copy', ['copy:images', 'copy:rootfiles', 'copy:fonts', 'copy:video', 'copy:ajaxIncludes']);

gulp.task('copy:watch', () => {
  gulp.watch(config.src.images + '/*', ['copy']);
});
