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
	path = require('path');	

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
	var runSequence = require('run-sequence').use(gulp);
	runSequence('clean', ['less', 'html', 'assets', 'js'], cb);
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/css/*.less', ['less']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/app/**/*.js', ['js']);
});

gulp.task('less', function() {
	var less = require('gulp-less'),
		plumber = require('gulp-plumber'),
		cleanCSS = require('gulp-clean-css'),
		LessPluginAutoPrefix = require('less-plugin-autoprefix'),
		autoprefixPlugin = new LessPluginAutoPrefix({browsers: browsers}),
		cssDir = path.normalize('src/css');

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
	var htmlrender = require('gulp-htmlrender');
	htmlrender.addTemplate('template', '<script id="{{id}}" type="text/ng-template"><%include src="{{src}}"%></script>');

	return gulp.src('src/index.html', {read: false})
		.pipe(htmlrender.render())
		.pipe(gulp.dest('dist'));
});
		
gulp.task('assets', function() {
	gulp.src(['vendor/**/*.*'], {cwd: 'src', base: 'src'})
		.pipe(gulp.dest('dist'));
});


gulp.task('js', function() {
	var uglify = require('gulp-uglify'),
		concat = require('gulp-concat');

	return gulp.src(['src/app/**/*.js'])
		.pipe(uglify())
		.pipe(concat('docs-player.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function() {
	var del = require('del');
	return del('dist');
});