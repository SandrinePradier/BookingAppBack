var gulp = require('gulp');
var babel = require ('gulp-babel');
var babelpolyfill = require('babel-polyfill');

gulp.task('babel', function(){
	console.log('launch of babel task');
	return gulp.src('src/**/*.js')
	// return gulp.src('src')
	.pipe(babel({
		presets:[['env', {
			"targets": {
        	"node": "current"
      		}
		}]]
	}))
	.pipe(gulp.dest('dist'))
})

