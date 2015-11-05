var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var gulp = require('gulp');
var less = require('gulp-less');
var mergeStream = require('merge-stream');
var nunjucksRender = require('gulp-nunjucks-render');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var debug = require('gulp-debug');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');
var browserify = require('browserify');
var watchify = require('watchify');
var autoprefix = require('gulp-autoprefixer');
var b = browserify();

var paths = {
    dist: 'dist/',
    distAssets: 'dist/assets/',
    src: 'src/',
    srcViews:'src/views/',
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
gulp.task('build:compress', compressTask);
gulp.task('serve', serveTask);
gulp.task('watch', watchTask);

//browserify watchify

function buildHtml() {
    nunjucksRender.nunjucks.configure([paths.src], { watch: false });
    return gulp.src([paths.src + '**/*.html', '!' + paths.src + '**/_*.html'])
        .pipe(nunjucksRender())
        .pipe(gulp.dest(paths.dist));
}

function buildCss() {
    return gulp.src(paths.src + 'main.less')
        .pipe(changed('main', {extension: 'less'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less())
        .pipe(autoprefix())
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.distAssets));
}

function buildJs() {
    return gulp.src([paths.srcViews + '**/*.js'])
        .pipe(changed('main', {extension: 'js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.srcAssets))
        .pipe(gulp.dest(paths.distAssets));
}

function buildAssets() {
    return mergeStream(gulp.src([])
        .pipe(gulp.dest(paths.distAssets + 'fonts/')),
            gulp.src([paths.srcAssets + 'images/**'], { base: paths.srcAssets })
        .pipe(gulp.dest(paths.distAssets))
    );
}

function compressTask(){
    return gulp.src(paths.dist + '**/*')
        .pipe(debug())
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest(paths.build));
}

function watchTask() {
    gulp.watch([paths.src + '*.html'], ['build:html']);
    gulp.watch([paths.srcViews + '**/*.js'], ['build:js']);
    gulp.watch([paths.srcViews + '**/*.less'], ['build:css']);
}

function serveTask() {
    browserSync.init({
        files: [paths.dist + '**/*'],
        online: false,
        server: {
            baseDir: paths.dist
        },
        ui: false
    });
}

