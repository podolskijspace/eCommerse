"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "app/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Optimize Images
function images() {
  return gulp
    .src("app/img/**/*")
    .pipe(newer("app/imgMin"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("app/imgMin"));
}

// CSS task
function css() {
  return gulp
    .src("app/sass/*.sass")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("app/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("app/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["app/js/**/*", "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// // Transpile, concatenate and minify scripts
// function scripts() {
//   return gulp
//       .src(["app/js/*.js"])
//       .pipe(plumber())
//       .pipe(webpackstream(webpackconfig, webpack))
//       // folder only, filename is specified in webpack config
//       .pipe(gulp.dest("app/js/"))
//       .pipe(browsersync.stream());
// }

// Jekyll
function jekyll() {
  return cp.spawn("bundle", ["exec","default"], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("app/sass/**/*", css);
  gulp.watch("app/js/*.js");
  gulp.watch(
    [
      "app/sass/*.sass",
      "app/css/*.css",
      "app/js/*.js",
      "app/*.html"
    ],
    gulp.series(browserSyncReload)
  );
  gulp.watch("app/img/**/*", images);
}

// Tasks
gulp.task("images", images);
gulp.task("css", css);
// gulp.task("js", gulp.series(scripts));


// watch
gulp.task("watch", gulp.parallel(watchFiles, browserSync));


// build
gulp.task(
  "default",
  gulp.series(gulp.parallel(css, images, "watch"))
);

gulp.task();