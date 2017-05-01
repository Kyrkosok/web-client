var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var del = require('del');
var using = require('gulp-using');

gulp.task('default', ['build', 'cleanup']);

gulp.task('build', function() {
  return gulp.src('./src/**/*')
    .pipe(using({}))
    .pipe(gulpIf('*.html', useref()))

    .pipe(gulpIf('js/*.js', uglify()))
    .pipe(gulpIf('css/*.css', autoprefixer()))
    .pipe(gulpIf('css/*.css', cleanCSS()))
    .pipe(gulp.dest('dist'))
});

gulp.task('cleanup', ['build'], function() {
  return del([
    'dist/js/application.js',
    'dist/js/leaflet.js',
    'dist/js/leaflet.markercluster.js',
    'dist/js/leaflet.locate.min.js',
    'dist/js/map.js',
    'dist/css/MarkerCluster.css',
    'dist/css/leaflet.css',
    'dist/css/leaflet.locate.min.css',
    'dist/css/app.css',
    'dist/css/map.css'
    ]);
});