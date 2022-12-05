import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
    return gulp.src('source/assets/sass/style.scss', {
        sourcemaps: true
    })
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            csso()
        ]))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/assets/css', {
            sourcemaps: '.'
        }))
        .pipe(browser.stream());
}


// HTML

const html = () => {
    return gulp.src('source/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
    return gulp.src('source/assets/js/**/*.js')
        .pipe(gulp.dest('build/assets/js'))
        .pipe(browser.stream());
}

const jsmin = () => {
    return gulp.src('source/assets/js/**/*.js')
        .pipe(terser())
}

// Images

const optimizeImages = () => {
    return gulp.src('source/assets/img/**/*.{png,jpg}')
        .pipe(squoosh())
        .pipe(gulp.dest('build/assets/img'))
}

const copyImages = () => {
    return gulp.src('source/assets/img/**/*.{png,jpg}')
        .pipe(gulp.dest('build/assets/img'))
}

// WebP

const createWebp = () => {
    return gulp.src('source/assets/img/**/*.{png,jpg}')
        .pipe(squoosh({
            webp: {}
        }))
        .pipe(gulp.dest('build/assets/img'))
}

// SVG

const svg = () =>
    gulp.src(['source/assets/img/**/*.svg', '!source/assets/img/sprite/*.svg'])
        .pipe(svgo())
        .pipe(gulp.dest('build/assets/img'));

const sprite = () => {
    return gulp.src('source/assets/img/sprite/*.svg')
        .pipe(svgo())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/assets/img'));
}

// Copy

const copy = (done) => {
    gulp.src([
        'source/assets/fonts/**/*.*',
        'source/assets/*.ico',
        'source/assets/favicons/*',
        'source/assets/*.webmanifest',
        // 'source/assets/css/normalize.css'
    ], {
        base: 'source'
    })
        .pipe(gulp.dest('build/assets'))
    done();
}


// Clean

const clean = () => {
    return del('build');
};

// Server

const server = (done) => {
    browser.init({
        server: {
            baseDir: 'build'
        },
        notify: false,
        open: false,
        cors: true,
    });
    done();
}

// Reload

const reload = (done) => {
    browser.reload();
    done();
}

// Watcher

const watcher = () => {
    gulp.watch('source/assets/sass/**/*.scss', gulp.series(styles));
    gulp.watch('source/assets/js/**/*.js', gulp.series(scripts));
    gulp.watch('source/*.html', gulp.series(html, reload));
    gulp.watch('source/assets/img/**/*.{png,jpg}', gulp.series(copyImages, createWebp));
    gulp.watch(['source/assets/img/**/*.svg', '!source/assets/img/sprite/*.svg'], gulp.series(svg));
    gulp.watch('source/assets/img/sprite/*.svg', gulp.series(sprite));
}

// Build

export const build = gulp.series(
    clean,
    copy,
    optimizeImages,
    gulp.parallel(
        styles,
        html,
        scripts,
        jsmin,
        svg,
        sprite,
        createWebp
    )
);

// Default


export default gulp.series(
    clean,
    copy,
    copyImages,
    gulp.parallel(
        styles,
        html,
        scripts,
        svg,
        sprite,
        createWebp
    ),
    gulp.series(
        server,
        watcher
    ));
