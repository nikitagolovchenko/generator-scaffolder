var config = require('../gulpConfig');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');

var processors = [
    autoprefixer({
      cascade: false,
      browsers: [
        "last 4 versions"
      ]
    }),
    mqpacker({
      sort: true
    })
];

gulp.task('sass',function(){
  console.log(process.env.NODE_ENV)
  console.log(config.production())
    return gulp.src([config.src.sass + '/*.{scss,sass}'])
      // console.log(config.production())
        .pipe(plumber({
          handleError: function (err) {
              console.log(err);
              this.emit('end');
            }
          }))
        .pipe(sass({
          outputStyle: config.production() ? 'compressed' : 'expanded'
        }))
        .pipe(gulpif(config.development(), sourcemaps.init()))
        // .pipe(gulpif(config.development(),
        //   sass({
        //     outputStyle: 'expanded'
        //   })
        // ), 
        //   sass({
        //     outputStyle: 'compressed'
        //   })
        // )
        // .pipe(sass({
        //   outputStyle: gulpif(config.development(), 'expanded', 'compressed')
        //  }))

        // .pipe(sassLint())
        // .pipe(sassLint.format())
        .pipe(postcss(processors))
        .pipe(gulpif(config.development(), sourcemaps.write()))
        .pipe(gulp.dest(config.dest.css));
});



gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*.{sass,scss}', ['sass']);
});