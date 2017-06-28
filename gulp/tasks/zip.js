'use strict';

module.exports = function () {
    $.gulp.task('zip', function () {
        return $.gulp.src('build/**/*.*')
            .pipe($.gp.zip($.package.name.toLowerCase() + '-' + $.package.version + '.zip'))
            .pipe($.gulp.dest('build/'));
    });
};