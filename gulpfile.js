/**
 * this is the main task runner for managing the SampleSDK
 */

/*
 * define requirements
 * ***********************************************************************************************
 */

var os = require('os');
var gulp = require('gulp');
var args   = require('yargs').argv;
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var clean = require('gulp-clean');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var stylish = require('jshint-stylish');
var colours = require('colors');
var fs = require('fs');
var exec = require('child_process').exec;
var sys = require('sys');
var tasklist = require('gulp-task-listing');
var runSequence = require('run-sequence');
var GJSDuck = require("gulp-jsduck");
var gjsduck = new GJSDuck(["--out", "docs"]);
var amdclean  = require('gulp-amdclean');
var argv = require('yargs').argv;

var PROJECT_BASE_PATH = __dirname + '';

// detect os type and specify requirejs command
var rJsCommand = 'r.js';
var isWin = /^win/.test(os.platform());
if(isWin) {
    rJsCommand = 'r.js.cmd';
}

/*
 * gulp default task
 * ***********************************************************************************************
 */

gulp.task('default', tasklist.withFilters(function(task) {
    return (["build","stream","clean","test","doc","bump-major","bump-minor","bump-patch"].indexOf(task) < 0);
}));

/*
 * gulp main tasks
 * ***********************************************************************************************
 */

gulp.task('build-require-ctlapiloader', function (cb) {
    executeCommand(rJsCommand + ' -o src/ctlapiloader/build.json', cb);
});

gulp.task('build-optimize-ctlapiloader', function (cb) {
    var pkg = require('./package.json');

    return gulp.src('./dist/' + pkg.name + '.js')
        .pipe(amdclean.gulp({
            'prefixMode': 'standard',
            'wrap': false
        }))
        .pipe(rename(pkg.name + '-' + pkg.version + '.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(uglify())
        .pipe(size({showFiles:true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-ctlapiloader', function (cb) {
    runSequence('clean', 'build-require-ctlapiloader', 'build-optimize-ctlapiloader', cb);
});

gulp.task('build-require-speakeasy', function (cb) {
    executeCommand(rJsCommand + ' -o src/speakeasy/build.json', cb);
});

gulp.task('build-optimize-speakeasy', function (cb) {
    var pkg = require('./package.json');

    return gulp.src('./dist/speakeasy.js')
        .pipe(amdclean.gulp({
            'prefixMode': 'standard',
            'wrap': false
        }))
        .pipe(rename('speakeasy-' + pkg.version + '.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-speakeasy', function (cb) {
    runSequence('clean', 'build-require-speakeasy', 'build-optimize-speakeasy', cb);
});

gulp.task('build', function (cb) {
    runSequence('clean', 'build-require-ctlapiloader', 'build-optimize-ctlapiloader', 'build-require-speakeasy', 'build-optimize-speakeasy', cb);
});

gulp.task('stream', function (cb) {
    gulp.watch(['./src/**/*.js'], ['build']);
});

gulp.task('clean', function (cb) {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('bump-patch', function(cb) {
    bumpHelper('patch', cb);
});

gulp.task('bump-minor', function(cb) {
    bumpHelper('minor', cb);
});

gulp.task('bump-major', function(cb) {
    bumpHelper('major', cb);
});

gulp.task('test', ['lint', 'karma-tests']);

gulp.task("doc", function(cb)
{
    return gulp.src(["./src/**/*.js", "!./src/lib/*"])
        .pipe(gjsduck.doc());
});

/*
 * gulp helper tasks
 * ***********************************************************************************************
 */

// versioning tasks

gulp.task('npm-bump-patch', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('npm-bump-minor', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('npm-bump-major', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type:'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('git-describe', function (cb) {
    console.log('Current release is now:');
    executeCommand('git describe --abbrev=0 --tags', cb);
});

gulp.task('git-tag', function(cb) {
    runSequence('git-tag-create', 'git-tag-push', 'git-describe', cb);
});

gulp.task('git-tag-create', function(cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;
    var commandLine = 'git tag -a ' + v + ' -m \'' + message + '\'';
    executeCommand(commandLine, cb);
});

gulp.task('git-tag-push', function(cb) {
    var commandLine = 'git push origin master --tags';
    executeCommand(commandLine, cb);
});

gulp.task('git-tag-commit', function(cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;
    var commandLine = 'git add -A && git commit -a -m\'' + message + '\'';
    executeCommand(commandLine, cb);
});

gulp.task('example-upgrade-tag', function(){
    var pkg = require('./package.json');
    var v = pkg.version;
    var file = 'kitchensink/www/*.html';

    return gulp.src([file])
        .pipe(replace(/ctlapi-([\d.]+)\.js/g, 'ctlapi-' + v + '.js'))
        .pipe(gulp.dest('kitchensink/www'));
});

gulp.task('upgrade-version', function(){
    var pkg = require('./package.json');
    var v = pkg.version;
    var file = 'src/Version.js';

    return gulp.src([file])
        .pipe(replace(/[\d.]+/g, v))
        .pipe(gulp.dest('src'));
});

// continous integration tasks

gulp.task('lint', function (cb) {
  return gulp.src('./src/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('karma-tests', function(cb){
    console.log();
    console.log('Run all the tests now');
    var karmaConfigFile = PROJECT_BASE_PATH+'/test/karma.conf.js';
    var commandLine = 'karma start '+karmaConfigFile;
    executeCommand(commandLine, cb);
    console.log();
});

/*
 * helper functions
 * ***********************************************************************************************
 */

// execute the command line command in the shell
function executeCommand(commandLine, cb) {
    exec(commandLine, function(error, stdout, stderr) {
        puts(error, stdout, stderr);
        cb(null); // will allow gulp to exit the task successfully
    });
}

// well display console expressions
function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

// will execute the needed stuff to bump successfully
function bumpHelper(bumpType, cb) {
    runSequence('npm-bump-'+bumpType, 'upgrade-version', 'build', 'example-upgrade-tag', 'git-tag-commit', 'git-tag', cb);
}
