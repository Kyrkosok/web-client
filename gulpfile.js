var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var del = require('del');

gulp.task('default', ['build', 'cleanup']);

gulp.task('build', function() {
  return gulp.src('./src/**/*')
    .pipe(gulpIf('*.html', useref()))
    .pipe(gulpIf('/js/*.js', uglify()))
    .pipe(gulpIf('/css/*.css', autoprefixer()))
    .pipe(gulpIf('/css/*.css', cleanCSS()))
    .pipe(gulp.dest('dist'))
});

gulp.task('cleanup', ['build'], function() {
  return del([
    'dist/js/application.js',
    'dist/js/jquery-3.1.1.js',
    'dist/js/leaflet.js',
    'dist/js/leaflet.markercluster.js',
    'dist/js/map.js',
    'dist/css/MarkerCluster.css',
    'dist/css/leaflet.css',
    'dist/css/app.css',
    'dist/css/map.css'
    ]);
});