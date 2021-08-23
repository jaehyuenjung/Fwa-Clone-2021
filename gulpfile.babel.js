import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import bro from "gulp-bro";
import babelify from "babelify";
import image from "gulp-image";
import ws from "gulp-webserver";

const sass = require("gulp-sass")(require("sass"));

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "dist",
    },
    css: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "dist/css",
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "dist/js",
    },
    img: {
        src: "src/img/*",
        dest: "dist/img",
    },
};

const pug = () =>
    gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const styles = () =>
    gulp
        .src(routes.css.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                flexbox: true,
                grid: "autoplace",
            })
        )
        .pipe(minify())
        .pipe(gulp.dest(routes.css.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }],
                ],
            })
        )
        .pipe(gulp.dest(routes.js.dest));

const img = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(["dist/styles.css"]);

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.css.watch, styles);
    gulp.watch(routes.js.watch, js);
    gulp.watch(routes.img.src, img);
};

const webserver = () =>
    gulp.src("dist").pipe(ws({ livereload: true, open: true }));

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, styles, js, img]);

const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
