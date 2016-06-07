const gulp = require('gulp');
const compress = require('gulp-yuicompressor');
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

paths = {
    handlebars: ['templates/*.hbs'],
    indexed: ['public/{post,repo}/**/*.html'],
    content: ['content/**/*']
}

gulp.task('release', ['mini_jpg', 'mini_png', 'index'], function () {});

gulp.task('clean', function () {
    return gulp.src('public', {read: false})
	.pipe(clean());
});

gulp.task('bower', ['clean'], function() {
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


gulp.task('handlebars', ['bower_copy'], function(){
    return gulp.src(paths.handlebars)
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

gulp.task('hugo', ['handlebars'], shell.task(['hugo']));

gulp.task('mini_js', ['hugo'], function () {
    const f = filter(['*', '!*.min.*']);

    return gulp.src('public/js/*.js')
	.pipe(compress({
	    type: 'js'
	}))
	.pipe(gulp.dest('public/js'));
});

gulp.task('mini_css', ['hugo'], function () {
    return gulp.src('public/css/*.css')
	.pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + Math.round((details.stats.minifiedSize / details.stats.originalSize) * 100) + '%');
        }))
	.pipe(gulp.dest('public/css'));
});

gulp.task('inline', ['mini_css', 'mini_js'], function () {
    return gulp.src('public/**/*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('public'));
});

gulp.task('mini_html', ['inline'], function() {
  return gulp.src('public/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
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


gulp.task('index', ['mini_html'], function () {
    return gulp.src(paths.indexed)
	.pipe(indexer('search.json'))
	.pipe(gulp.dest('./public'));
});
