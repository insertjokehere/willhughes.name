const gulp = require('gulp');
const compress = require('gulp-yuicompressor');
const shell = require('gulp-shell');
const htmlmin = require('gulp-htmlmin');
const indexer = require('./indexer.js');
const bower = require('gulp-bower');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const filter = require('gulp-filter');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');

gulp.task('default', ['release', 'dev'], function () {});

gulp.task('release', ['hugo', 'mini_js', 'mini_css', 'mini_html', 'mini_png'], function () {});

gulp.task('dev', ['index'], function () {
    gulp.src('public/search.json').pipe(gulp.dest('static/'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('bower_copy', ['bower'], function() {
    gulp.src('bower_components/lunr.js/lunr.js')
	.pipe(gulp.dest('./static/js'));

    // YUI gets really, really confused if we try to minify the main JQuery JS
    gulp.src('bower_components/jquery/dist/jquery.min.{js,map}')
	.pipe(gulp.dest('./static/js'));

    gulp.src('bower_components/pure/pure.css')
	.pipe(gulp.dest('./static/css'));

    gulp.src('bower_components/pure/grids-responsive-old-ie.css')
	.pipe(gulp.dest('./static/css'));
    
    gulp.src('bower_components/pure/grids-responsive.css')
	.pipe(gulp.dest('./static/css'));

    gulp.src('bower_components/font-awesome/fonts/*')
	.pipe(gulp.dest('./static/fonts/'));

    gulp.src('bower_components/font-awesome/css/font-awesome.css')
	.pipe(gulp.dest('./static/css'));

    gulp.src('bower_components/handlebars/handlebars.runtime.js')
	.pipe(gulp.dest('./static/js'));
});


gulp.task('handlebars', function(){
    gulp.src('templates/*.hbs')
	.pipe(handlebars({
	    handlebars: require('handlebars')
	}))
	.pipe(wrap('Handlebars.template(<%= contents %>)'))
	.pipe(declare({
	    namespace: 'Blog.templates',
	    noRedeclare: true, // Avoid duplicate declarations 
	}))
	.pipe(concat('templates.js'))
	.pipe(gulp.dest('static/js/'));
});

gulp.task('hugo', ['bower_copy', 'handlebars'], shell.task(['hugo']));

gulp.task('mini_js', ['hugo', 'bower_copy'], function () {
    const f = filter(['*', '!*.min.*']);
    
    gulp.src('public/**/*.js')
	.pipe(f)
	.pipe(compress({
	    type: 'js'
	}))
	.pipe(gulp.dest('public'));
});

gulp.task('mini_css', ['hugo', 'bower_copy'], function () {
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
