// var gulp = require('gulp');
// var babelify = require('babelify');
// var browserify = require('browserify');
// var jshint = require('gulp-jshint');
// var jscs = require('gulp-jscs');
// var source = require('vinyl-source-stream');
// var audiosprite = require('audiosprite');
// var glob = require('glob');
// var shell = require('gulp-shell');
// var fs = require('fs');
// var rename = require('gulp-rename');
// var connect = require('gulp-connect');
// var sourcemaps = require('gulp-sourcemaps');
// var uglify = require('gulp-uglify');
// const nodemon = require('gulp-nodemon');

// gulp.task('modules', function() {
//   browserify({
//     entries: './main.js',
//     debug: true
//   }).transform(babelify)
//     .bundle()
//     .pipe(source('main.js'))
//     .pipe(rename('duckhunt.js'))
//     .pipe(gulp.dest('./dist'))
//     // .pipe(connect.reload());
// });
//
// gulp.task('jshint', function() {
//   return gulp.src([
//     'src/modules/**',
//     'duckhunt.js'
//   ]).pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(jshint.reporter('fail'))
// });
//
// gulp.task('jscs', function() {
//   return gulp.src([
//     'src/modules/*.js',
//     'duckhunt.js'
//   ]).pipe(jscs())
// });
//
// gulp.task('watch', function() {
//   gulp.watch(['./src/modules/*.js', './src/data/*.json', 'main.js', 'libs/*.js'], ['jshint', 'jscs', 'modules']);
//   // gulp.watch(['./src/assets/images/**/*.png'], ['images']);
//   // gulp.watch(['./src/assets/sounds/**/*.mp3'], ['audio']);
// });
//
// gulp.task('serve', function () {
//   nodemon({
//     script: 'server/server.js',
//     ignore: ['client/', 'build/'],
//   });
// });
//
// gulp.task('audio', function() {
//   var files = glob.sync('./src/assets/sounds/*.mp3');
//   var outputPath = './dist/audio';
//   var opts = {
//     output: outputPath,
//     path: './',
//     format: 'howler',
//     'export': 'ogg,mp3',
//     loop: ['quacking', 'sniff']
//   };
//
//   return audiosprite(files, opts, function(err, obj) {
//     if (err) {
//       console.error(err);
//     }
//
//     return fs.writeFile('./dist/audio' + '.json', JSON.stringify(obj, null, 2));
//   });
// });
//
// gulp.task('images', function(){
//   // There is a texturepacker template for spritesmith but it doesn't work
//   // well with complex directory structures, so instead we use the shell
//   // checking TexturePacker --version first ensures it bails if TexturePacker
//   // isn't installed
//   return gulp.src('', {read:false})
//     .pipe(shell([
//       'TexturePacker --version || echo ERROR: TexturePacker not found, install TexturePacker',
//       'TexturePacker --disable-rotation --data dist/sprites.json --format json --sheet dist/sprites.png src/assets/images'
//     ]))
//     .pipe(connect.reload());
// });
//
// gulp.task('deploy', function() {
//   return gulp.src('', {read:false})
//     .pipe(shell([
//     'AWS_PROFILE=duckhunt terraform plan',
//     'AWS_PROFILE=duckhunt terraform apply',
//     'aws --profile duckhunt s3 sync dist/ s3://duckhuntjs.com --include \'*\' --acl \'public-read\''
//   ]));
// });
//
// gulp.task('js', ['jshint', 'jscs', 'modules']);
// gulp.task('dev', ['js', 'watch', 'serve']);
// gulp.task('default', ['js', 'watch']);

var gulp       = require('gulp');
var browserify = require('browserify');
var watchify   = require('watchify');
var streamify  = require('gulp-streamify');
var cssMin     = require('gulp-css');
var uglify     = require('gulp-uglify');
var notify     = require('gulp-notify');
var to5ify     = require('6to5ify');
var source     = require('vinyl-source-stream');

gulp.task('cssMinfy', function(){
    gulp.src('statics/css/*.css')
    .pipe(cssMin())
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function () {
    watchify(browserify('main.js'))
        .transform(to5ify)
        .bundle()
        .on('error', function(err) {
            console.error(err.message);
        })
        .pipe(source('duckhunt.js'))
        .pipe(streamify(uglify('./dist/')))
        .pipe(gulp.dest('./dist/'))
        .pipe(notify("Built Bundle"));
});

gulp.task('default', ['browserify']);

gulp.task('watch', function () {
    gulp.src('./')
        // .pipe(webserver({
        //     livereload: true,
        // }));
    gulp.start('default');
    gulp.watch('src/*.jsx', ['default']);
});
