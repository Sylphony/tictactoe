var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var preprocess = require("gulp-preprocess");
var merge = require("merge-stream");

// Compile SCSS 
gulp.task("scssCompile", function() {
	return gulp.src("src/assets/scss/index.scss")
		.pipe(sass({
			outputStyle: "expanded"
		}))
        .pipe(gulp.dest("src/assets/css/"));
});

// Minify JS
gulp.task("jsMin", function() {
	return gulp.src("src/app/main.js")
		.pipe(uglify())
		.pipe(gulp.dest("dist/app/"));
});

// CSS concat
gulp.task("cssConcat", ["scssCompile"], function() {
	return gulp.src(["src/bower_components/bootstrap/index.css", "src/assets/css/index.css"])
		.pipe(concat("main.css"))
		.pipe(gulp.dest("dist/assets/css/"));
});

// Minify CSS
gulp.task("cssMin", ["scssCompile", "cssConcat"], function() {
	return gulp.src("dist/assets/css/main.css")
		.pipe(sass({
			outputStyle: "compressed"
		}))
		.pipe(gulp.dest("dist/assets/css/"));
});

// Copy files to "dist"
gulp.task("copyFiles", function() {
	return gulp.src("src/bower_components/angular/index.js")
		.pipe(gulp.dest("dist/bower_components/angular/"));
});

// Preprocess index.html
gulp.task("preprocess", function() {
	return gulp.src("src/index.html")
		.pipe(preprocess({
			context: {
				"mode": "prod"
			}
		}))
		.pipe(gulp.dest("dist/"));
});

// Watch task
gulp.task("scssWatch", function() {
	gulp.watch("src/assets/scss/**/*.scss", ["scssCompile"]);
});


gulp.task("distribute", ["scssCompile", "cssConcat", "cssMin", "jsMin", "copyFiles", "preprocess"]);
gulp.task("default", ["distribute"]);
