const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');
const webpack = require('webpack-stream');
const sequence = require('gulp-sequence');
const gulpWatch = require('gulp-watch');
const chalk = require('chalk');
const moment = require('moment');

const tsProject = ts.createProject('tsconfig.json');

//#region config
const config = {
  ts: {
    src: [
      'src/**/*.ts',
      '!src/extra.ts',
      '!src/.tea/**/*',
    ],
    dest: 'dist'
  },
  less: {
    src: [
      'src/**/*.less',
      '!src/.tea/**/*',
    ],
    dest: 'dist',
  },
  html: {
    src: [
      'src/**/*.html',
      '!src/.tea/**/*',
    ],
    dest: 'dist',
  },
  images: {
    src: [
      'src/images/*',
      '!src/.tea/**/*',
    ],
    dest: 'dist/images'
  },
  json: {
    src: [
      'src/**/*.json',
      '!src/.tea/**/*',
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
const compileTs = () => {
  return gulp.src(config.ts.src)
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(config.ts.dest));
}

const compileLess = () => {
  return gulp.src(config.less.src)
    .pipe(less())
    .pipe(rename(path => {
      path.extname = '.acss';
    }))
    .pipe(gulp.dest(config.less.dest));
}

const compileImages = () => {
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
}

const compileHtml = () => {
  return gulp.src(config.html.src)
    .pipe(rename(path => {
      path.extname = '.axml';
    }))
    .pipe(gulp.dest(config.html.dest));
}

const compileJson = () => {
  return gulp.src(config.json.src)
    .pipe(gulp.dest(config.json.dest));
}

const compileExtra = () => {
  return gulp.src(config.extra.src)
    .pipe(webpack())
    .pipe(rename(path => {
      path.basename = 'extra'
    }))
    .pipe(gulp.dest(config.extra.dest));
}

//#endregion

//#region watch

const watchTs = () => gulp.watch(config.ts.src, { ignoreInitial: false }, compileTs)

const watchLess = () => gulp.watch(config.less.src, { ignoreInitial: false }, compileLess)

const watchImages = () => gulp.watch(config.images.src, { ignoreInitial: false }, compileImages)

const watchHtml = () => gulp.watch(config.html.src, { ignoreInitial: false }, compileHtml)

const watchJson = () => gulp.watch(config.json.src, { ignoreInitial: false }, compileJson)

const watchExtra = () => gulp.watch(config.extra.src, { ignoreInitial: false }, compileExtra)


const watch = () => {
  [
    watchTs,
    watchLess,
    watchImages,
    watchHtml,
    watchJson,
    watchExtra
  ].map(wacher => {
    wacher()
      .on('change', (path, stats) => console.log(`[${ moment().format('HH:mm:ss') }] ${ chalk.blueBright('File') } ${ path } ${ chalk.cyanBright('Changed') }`))
      .on('unlink', (path, stats) => console.log(`[${ moment().format('HH:mm:ss') }] ${ chalk.blueBright('File') } ${ path } ${ chalk.redBright('Removed') }`))
      .on('add', (path, stats) => console.log(`[${ moment().format('HH:mm:ss') }] ${ chalk.blueBright('File') } ${ path } ${ chalk.greenBright('Added') }`))
  })
}

//#endregion

const copyIdeconfig =  () => {
  return gulp.src(config.ideconfig.src) 
    .pipe(gulp.dest(config.ideconfig.dest));
}

const clean = (cb) => {
  return del([
    'dist',
  ], cb)
};

const build = gulp.series(clean, copyIdeconfig, gulp.parallel(compileTs, compileLess, compileImages, compileHtml, compileJson), compileExtra)


gulp.task('build', build);
gulp.task('default', gulp.series(build, watch));
