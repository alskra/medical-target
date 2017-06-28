'use strict';

module.exports = function () {
    $.gulp.task('dev', $.gulp.series('build', $.gulp.parallel('server', 'watch')));
};