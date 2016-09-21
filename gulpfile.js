const gulp = require('gulp');
const shell = require('gulp-shell');
const htmlmin = require('gulp-htmlmin');
const indexer = require('./indexer.js');
const bower = require('gulp-bower');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');
const filter = require('gulp-filter');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const inlinesource = require('gulp-inline-source');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
const webpack = require('webpack');
var gutil = require("gulp-util");

gulp.task('default', ['mini_jpg', 'mini_png', 'mini_html'], function () {});

gulp.task('clean', function () {
    return gulp.src('public', {read: false})
	.pipe(clean());
});

gulp.task("webpack", function(callback) {
    // run webpack
    webpack(require('./themes/blackburn/webpack.config.js'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('hugo', ['webpack'], shell.task(['hugo']));

gulp.task('mini_html', ['hugo'], function () {
    return gulp.src('public/**/*.html')
               .pipe(inlinesource())
               .pipe(htmlmin({collapseWhitespace: true}))
               .pipe(gulp.dest('public'));
});

gulp.task('mini_png', ['hugo'], function() {
    return gulp.src('public/img/**/*.png')
	.pipe(imagemin({
	    progressive: true,
	    svgoPlugins: [{removeViewBox: false}],
	    use: [pngquant()]
	}))
	.pipe(gulp.dest('public/img/'))
});

gulp.task('mini_jpg', ['hugo'], function() {
    return gulp.src('public/img/**/*.jpg')
	.pipe(imagemin({
	    progressive: true,
	    svgoPlugins: [{removeViewBox: false}],
	    use: [jpegtran()]
	}))
	.pipe(gulp.dest('public/img/'))
});
