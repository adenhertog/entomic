var gulp = require("gulp");
var gutil = require("gulp-util");
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');
var plumber = require('gulp-plumber');
var insertLines = require('gulp-insert-lines');
var del = require("del");

const DIST = "./dist/";
const CONTENT_FILES = "src/**/*.{htm,html,json}";

gulp.task('default', ['clean'], function () {
	gulp.start('content', 'scripts');
});

gulp.task('watch', function () {

	// Watch .coffee files
	gulp.watch('src/**/*.coffee', ['test']);

	// Watch .html files
	gulp.watch(CONTENT_FILES, ["content"])

});

gulp.task('clean', function (cb) {
	del(['dist/'], cb)
});

gulp.task("content", function () {
	return gulp.src(CONTENT_FILES)
		.pipe(gulp.dest(DIST));
});

gulp.task('scripts', function () {
	return gulp.src('./src/**/*.coffee')
		.pipe(plumber())
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest(DIST))
});

gulp.task('executable', ['scripts'], function () {
	return gulp.src('./dist/index.js')
		.pipe(insertLines({
			'before': /var AdmZip.*$/i,
			'lineBefore': '#!/usr/bin/env node'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task("test", ["executable", "content"], function () {
	return gulp.src('./dist/**/*.spec.js')
		.pipe(plumber())
		.pipe(jasmine({ verbose: true, includeStackTrace: true }));
});