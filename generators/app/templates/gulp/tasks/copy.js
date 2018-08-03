var config = require('../gulpConfig.js');
var gulp = require('gulp');
let changed = require('gulp-changed');

gulp.task('copy:rootfiles', function () {
    return gulp
        .src(config.src.root + '/*.*')
        .pipe(gulp.dest(config.dest.root));
});

gulp.task('copy:fonts', function () {
    return gulp
        .src(config.src.fonts + '/**/*.{ttf,svg,eot,woff,woff2}')
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:images', function () {
    return gulp
        .src([
            config.src.images + '/**/*.{jpg,png,jpeg,svg,gif}'
        ])
        // .pipe(changed(config.dest.images))
        .pipe(gulp.dest(config.dest.images));
});

gulp.task('copy', [
    'copy:images',
    // 'copy:rootfiles',
    'copy:fonts'
]);

gulp.task('copy:watch', function () {
    gulp.watch(config.src.images + '/*', ['copy']);
});