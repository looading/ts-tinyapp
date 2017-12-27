const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');
const webpack = require('webpack-stream');
const sequence = require('gulp-sequence');

const tsProject = ts.createProject('tsconfig.json');

//#region config
const config = {
  ts: {
    src: [
      'src/**/*.ts',
      'src/!extra.ts',
      'src/!.tea/**/*',
    ],
    dest: 'dist'
  },
  less: {
    src: [
      'src/**/*.less',
      'src/!.tea/**/*',
    ],
    dest: 'dist',
  },
  html: {
    src: [
      'src/**/*.html',
      'src/!.tea/**/*',
    ],
    dest: 'dist',
  },
  images: {
    src: [
      'src/images/*',
      'src/!.tea/**/*',
    ],
    dest: 'dist/images'
  },
  json: {
    src: [
      'src/**/*.json',
      'src/!.tea/**/*',
    ],
    dest: 'dist',
  },
  extra: {
    src: 'src/extra.ts',
    dest: 'dist'
  },
  ideconfig: {
    src: 'src/.tea/**/*',
    dest: 'dist/.tea',
  },
}
//#endregion

//#region compile
gulp.task('compile::ts', () => {
  return gulp.src(config.ts.src)
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(config.ts.dest));
});

gulp.task('compile::less', () => {
  return gulp.src(config.less.src)
    .pipe(less())
    .pipe(rename(path => {
      path.extname = '.acss';
    }))
    .pipe(gulp.dest(config.less.dest));
});

gulp.task('compile::images', () => {
  return gulp.src(config.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(config.images.dest));
});

gulp.task('compile::html', () => {
  return gulp.src(config.html.src)
    .pipe(rename(path => {
      path.extname = '.axml';
    }))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('compile::json', () => {
  return gulp.src(config.json.src)
    .pipe(gulp.dest(config.json.dest));
});

gulp.task('compile::extra', () => {
  return gulp.src(config.extra.src)
    .pipe(webpack())
    .pipe(rename(path => {
      path.basename = 'extra'
    }))
    .pipe(gulp.dest(config.extra.dest));
});;

//#endregion

//#region watch
gulp.task('watch', [
  'watch::ts',
  'watch::less',
  'watch::images',
  'watch::html',
  'watch::json',
  'watch::extra',
]);

gulp.task('watch::ts', () => gulp.watch(config.ts.src, [ 'compile::ts' ]));

gulp.task('watch::less', () => gulp.watch(config.less.src, [ 'compile::less' ]));

gulp.task('watch::images', () => gulp.watch(config.images.src, [ 'compile::images' ]));

gulp.task('watch::html', () => gulp.watch(config.html.src, [ 'compile::html' ]));

gulp.task('watch::json', () => gulp.watch(config.json.src, [ 'compile::json' ]));

gulp.task('watch::extra', () => gulp.watch(config.extra.src, [ 'compile::extra' ]));
//#endregion

gulp.task('copy::ideconfig', () => {
  return gulp.src(config.ideconfig.src) 
    .pipe(gulp.dest(config.ideconfig.dest));
});

gulp.task('clean', (cb) => {
  return del([
    'dist',
  ], cb)
})

gulp.task('build', sequence(
  'clean',
  'copy::ideconfig' ,
  [
    'compile::ts',
    'compile::less',
    'compile::images',
    'compile::html',
    'compile::json',
  ],
  'compile::extra',
));

gulp.task('default', sequence(
  'build',
  'watch'
));
