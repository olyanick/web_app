var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var babelify = require('babelify');
var nodemon = require('gulp-nodemon')

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('scripts', function () {
  var bundler = browserify('./app/app.js', {basedir: __dirname, debug: true});
  bundler.transform("babelify", {presets: ["react", "es2015"]}).on('error',handleError);
  var stream = bundler.bundle();
  return stream
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./assets/js'));
});
gulp.task("watch", function () {
  gulp.watch("./app/**/*", ['scripts']);
});
gulp.task("default", ['watch', 'scripts']);
