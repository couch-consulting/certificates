var gulp = require('gulp');
var del = require('del');
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var typedoc = require("gulp-typedoc");

var tsProject = ts.createProject("tsconfig.json");

// Configuration

var files = {
  projectSources: [
    'src/**/*.ts',
  ],
  projectTestSources: [],
  projectAssets: [],
  vendorAssets: [],
};

var targetDirectory = 'build/app/';

// Cleanup

function clean() {
  return del(['build']);
}

// Code validation

function validateSources() {
  return gulp.src(files.projectSources)
    .pipe(tslint({
      formatter: 'verbose',
      configuration: 'tslint.json',
    }))
    .pipe(tslint.report());
}

var codeValidation = gulp.parallel(validateSources);

// Uglify code

function compileCode(done) {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(targetDirectory + 'src'));
}

var codeCompilation = gulp.parallel(compileCode);

// Code documentation

function generateDocumentation(done) {
  return gulp.src(files.projectSources)
    .pipe(typedoc({
      out: './build/documentation',
      module: 'commonjs',
      "target": "es2015",
    }));
}

var codeDocumentation = gulp.series(generateDocumentation);

// Common task definition

gulp.task('build', gulp.series(clean, codeValidation, gulp.parallel(codeCompilation, codeDocumentation)));
gulp.task('default', gulp.series('build'));
