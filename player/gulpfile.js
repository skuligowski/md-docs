var browsers = [
	'ie >= 10', 
	'ff >= 30', 
	'chrome >= 34', 
	'safari >= 7', 
	'opera >= 23', 
	'ios >= 7', 
	'android >= 4.3', 
	'bb >= 10'
];

var gulp = require('gulp'),
	less = require('gulp-less'),
	plumber = require('gulp-plumber'),
	path = require('path'),
	cleanCSS = require('gulp-clean-css'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	autoprefixPlugin = new LessPluginAutoPrefix({browsers: browsers}),
	htmlrender = require('gulp-htmlrender'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	runSequence = require('run-sequence').use(gulp);

htmlrender.addTemplate('template', '<script id="{{id}}" type="text/ng-template"><%include src="{{src}}"%></script>');

gulp.task('build', function(cb) {
	runSequence('clean', ['less', 'html', 'assets', 'js'], cb);
});

gulp.task('watch', function() {
    gulp.watch('src/css/*.less', ['less']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/app/**/*.js', ['js']);
});


gulp.task('less', function() {
	var cssDir = path.normalize('src/css');
	return gulp.src(path.join(cssDir, 'index.less'))
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(less({
			paths: [cssDir],
			plugins: [autoprefixPlugin]
		}))
		.pipe(cleanCSS())				
		.pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
	return gulp.src('src/index.html', {read: false})
		.pipe(htmlrender.render())
		.pipe(gulp.dest('dist'));
});
		
gulp.task('assets', function() {
	gulp.src(['vendor/**/*.*'], {cwd: 'src', base: 'src'})
		.pipe(gulp.dest('dist'));
});


gulp.task('js', function() {
	return gulp.src(['src/app/**/*.js'])
		.pipe(uglify())
		.pipe(concat('docs-player.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function() {
	return del('dist');
});