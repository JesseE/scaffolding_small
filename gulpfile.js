var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var gulp = require('gulp');
var less = require('gulp-less');
var mergeStream = require('merge-stream');
var nunjucksRender = require('gulp-nunjucks-render');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var gzip = require('gulp-gzip');

var paths = {
    dist: 'dist/',
    distAssets: 'dist/assets/',
    src: 'src/',
    srcAssets: 'src/assets/',
    build:'build/'
};

gulp.task('build', function(cb) { runSequence('build:clean', 'build:all', cb); });
gulp.task('build:clean', function (cb) { rimraf(paths.dist, cb); });
gulp.task('build:all', ['build:html', 'build:css', 'build:js', 'build:assets']);
gulp.task('build:assets', buildAssets);
gulp.task('build:html', buildHtml);
gulp.task('build:css', buildCss);
gulp.task('build:js', buildJs);
gulp.task('build:compress', compress);
gulp.task('serve', serve);
gulp.task('watch', watchTask);

function buildHtml() {
    nunjucksRender.nunjucks.configure([paths.src], { watch: false });
    return gulp.src([paths.src + '**/*.html', '!' + paths.src + '**/_*.html'])
        .pipe(nunjucksRender())
        .pipe(gulp.dest(paths.dist));
}

function buildAssets() {
    return mergeStream(
        gulp.src([
            'node_modules/bootstrap/fonts/**',
            'src/assets/fonts/**'
        ])
            .pipe(gulp.dest(paths.distAssets + 'fonts/')),
        gulp.src([paths.srcAssets + 'images/**'], { base: paths.srcAssets })
            .pipe(gulp.dest(paths.distAssets))
    );
}

function buildCss() {
    return gulp.src(paths.srcAssets + 'index.less')
        .pipe(less())
        .pipe(gulp.dest(paths.distAssets));
}

function buildJs() {
    return gulp.src([
        paths.srcAssets + 'scripts/*.js'
    ])
        .pipe(concat('index.js'))
        .pipe(gulp.dest(paths.distAssets));
}

function serve() {
    browserSync.init({
        files: [paths.dist + '**/*'],
        online: false,
        server: {
            baseDir: paths.dist
        },
        ui: false
    });
}

function watchTask() {
    gulp.watch([paths.src + '**/*.html'], ['build:html']);
    gulp.watch([paths.src + '**/*.js'], ['build:js']);
    gulp.watch([paths.src + '**/*.less'], ['build:css']);
}
function compress(){
    return gulp.src(paths.dist)
        .pipe(gzip())
        .pipe(gulp.dest(paths.build));
}