// Require all tasks in gulp/tasks, including subfolders
require('require-dir')('./gulp/tasks', {recurse: true});

// var gulp = require('gulp');
// var plumber = require('gulp-plumber');
// var rename = require('gulp-rename');
// var sourcemaps = require('gulp-sourcemaps');
// var sass = require('gulp-sass');
// var csslint = require('gulp-csslint');
// var autoPrefixer = require('gulp-autoprefixer');
// //if node version is lower than v.0.1.2
// // require('es6-promise').polyfill();
// var cssComb = require('gulp-csscomb');
// // var cmq = require('gulp-merge-media-queries');
// var gcmq = require('gulp-group-css-media-queries');
// var cleanCss = require('gulp-clean-css');
// var babel = require('gulp-babel');
// var jshint = require('gulp-jshint');
// var browserify = require('gulp-browserify');
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var watch = require('gulp-watch');
// gulp.task('sass',function(){
//     gulp.src(['css/src/**/*.sass'])
//         .pipe(plumber({
//             handleError: function (err) {
//                 console.log(err);
//                 this.emit('end');
//             }
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(sass())
//         .pipe(autoPrefixer())
//         .pipe(cssComb())
//         .pipe(cmq({log:true}))
//         .pipe(csslint())
//         .pipe(csslint.formatter())
//         .pipe(concat('main.css'))
//         .pipe(gulp.dest('css/dist'))
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(cleanCss())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('css/dist'))
// });
// gulp.task('babel',function(){
//     gulp.src(['js/src/**/*.js'])
//         .pipe(plumber({
//             handleError: function (err) {
//                 console.log(err);
//                 this.emit('end');
//             }
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         .pipe(concat('main.js'))
//         .pipe(jshint())
//           .pipe(jshint.reporter('default'))
//           .pipe(browserify())
//         .pipe(gulp.dest('js/dist'))
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('js/dist'))
// });
// gulp.task('html',function(){
//     gulp.src(['html/**/*.html'])
//         .pipe(plumber({
//             handleError: function (err) {
//                 console.log(err);
//                 this.emit('end');
//             }
//         }))
//         .pipe(gulp.dest('./'))
// });
// gulp.task('default',function(){
//     gulp.watch('js/src/**/*.js',['babel']);
//     gulp.watch('css/src/**/*.sass',['sass']);
//     gulp.watch('html/**/*.html',['html']);
// });
