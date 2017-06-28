'use strict';

module.exports = function () {
    $.gulp.task('misc', function() {
        return $.combiner(
            $.gulp.src(['sources/static/misc/**/*.*']),
            $.gp.newer('build/'),
            $.gp.debug({title: 'DEBUG "misc": '}),
            $.gulp.dest('build/'),
            $.browserSync.reload({stream: true})
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "misc": ',
                message: err.message
            }
        }));
    });
};