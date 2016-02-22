// Gulp dependencies
var gulp  = require('gulp');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

// Development Dependencies
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');

// Build Dependencies
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Express Server
var express = require('express');
var nodemon = require('gulp-nodemon');


function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('browserify-uglify-js', function() {
    return gulp.src('public/provided.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
         }))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename('provided.min.js'))
        .pipe(gulp.dest('public/assets'))
});

gulp.task('minify-css', function() {
    return gulp.src('public/css/style.css')
        .pipe(minifyCSS())
        .on('error', swallowError)
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('public/assets'));
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/*.js');
});

gulp.task('nodemon', function() {
    nodemon({
        varbose: true,
        script: './server.js',
        ext: 'js json',
        watch: 'server',
        env: { 'NODE_ENV': 'development' }
    })
        .on('restart', function() {
            console.log('[~console] Server restarted!');
        });
});

gulp.task('default', ['nodemon', 'watch', 'minify-css']);