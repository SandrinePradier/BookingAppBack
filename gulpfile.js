var gulp = require('gulp');
var babel = require ('gulp-babel');

gulp.task('babel', function(){
	console.log('launch of babel task');
	return gulp.src('src/**/*.js')
	.pipe(babel({
		presets:['env']
	}))
	.pipe(gulp.dest('dist'))
})