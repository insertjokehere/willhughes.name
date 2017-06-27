const gulp = require('gulp');
const shell = require('gulp-shell');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');
const inlinesource = require('gulp-inline-source');
const clean = require('gulp-clean');
const webpack = require('webpack');
const gutil = require("gulp-util");
const rename = require("gulp-rename");
const imageResize = require('gulp-image-resize');

gulp.task('default', ['hugo'], function () {});

gulp.task('clean', function () {
    return gulp.src('public', {read: false})
	.pipe(clean());
});

gulp.task("webpack", function(callback) {
    // run webpack
    return webpack(require('./themes/blackburn/webpack.config.js'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('hugo', ['webpack', 'mini_png', 'mini_jpg', 'thumbnails'], shell.task(['hugo']));

gulp.task('mini_html', ['hugo'], function () {
    return gulp.src('public/**/*.html')
               .pipe(inlinesource())
               .pipe(htmlmin({collapseWhitespace: true}))
               .pipe(gulp.dest('public'));
});

gulp.task('mini_png', function() {
    return gulp.src('assets/img/**/*.png')
	       .pipe(imagemin({
		   progressive: true,
		   svgoPlugins: [{removeViewBox: false}],
		   use: [pngquant()]
	       }))
	       .pipe(gulp.dest('static/img/'))

});

gulp.task('mini_jpg', function() {
    return gulp.src('assets/img/**/*.jpg')

	       .pipe(imagemin({
		   progressive: true,
		   svgoPlugins: [{removeViewBox: false}],
		   use: [jpegtran()]
	       }))
	       .pipe(gulp.dest('static/img/'))
    
});

gulp.task('thumbnails', function() {
    return gulp.src('assets/img/**/*.{jpg,png}')
	       .pipe(imageResize({ width: 250 }))
	       .pipe(rename(function (path) { path.basename = "thumbs/" + path.basename; }))
    	       .pipe(gulp.dest('static/img/'));
});

gulp.task('watch', function () {
    gulp.watch('assets/img/**/*.{jpg,png}', ['thumbnails', 'mini_png', 'mini_jpg']);
});
