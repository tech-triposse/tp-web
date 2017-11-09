var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin');
    concat = require('gulp-concat');

gulp.task('styles', function(){
    return gulp.src('assets/css/*.css')
    .pipe(concat('main.css'))
    .pipe(minifyCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('js', function(){
    return gulp.src('assets/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});

gulp.task('imagemin', function(){
  return gulp.src('assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
});

gulp.task('default', function() {
    gulp.run('styles'),
    gulp.run('js'),
    gulp.run('imagemin'),
    gulp.watch(['styles', 'js', 'imagemin'])
  });
