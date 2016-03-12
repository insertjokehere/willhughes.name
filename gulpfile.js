var gulp = require('gulp');
var compress = require('gulp-yuicompressor');
var shell = require('gulp-shell');
var htmlmin = require('gulp-htmlmin');
var indexer = require('./indexer.js');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('default', ['release', 'dev'], function () {});

gulp.task('release', ['hugo', 'mini_js', 'mini_css', 'mini_html', 'mini_png'], function () {});

gulp.task('dev', ['index'], function () {
    gulp.src('public/search.json').pipe(gulp.dest('static/'));
});

gulp.task('hugo', shell.task(['hugo']));

gulp.task('mini_js', ['hugo'], function () {
    gulp.src('public/**/*.js')
	.pipe(compress({
	    type: 'js'
	}))
	.pipe(gulp.dest('public'));
});

gulp.task('mini_css', ['hugo'], function () {
    gulp.src('public/**/*.css')
	.pipe(compress({
	    type: 'css'
	}))
	.pipe(gulp.dest('public'));
});

gulp.task('mini_html', ['hugo'], function() {
  return gulp.src('public/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
});

gulp.task('mini_png', ['hugo'], function() {
    return gulp.src('public/images/*.png')
	.pipe(imagemin({
	    progressive: true,
	    svgoPlugins: [{removeViewBox: false}],
	    use: [pngquant()]
	}))
	.pipe(gulp.dest('public/images/'))
});

gulp.task('index', ['hugo'], function () {
    return gulp.src('public/{post,repo}/**/*.html')
	.pipe(indexer('search.json'))
	.pipe(gulp.dest('./public'));
});