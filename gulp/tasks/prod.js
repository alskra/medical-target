'use strict';

module.exports = function () {
    $.gulp.task('prod', $.gulp.series(
        function (done) {
            $.isDevelopment = false;
            done();
        },
        $.gulp.series('build', $.gulp.parallel('css.main', 'js.main'), $.gulp.parallel('server', 'zip'))
    ));
};