'use strict';

module.exports = function () {
    $.gulp.task('js.main', function () {
        return $.combiner(
            $.gulp.src(['build/static/js/components.js', 'build/static/js/blocks.js']),
            $.gp.concat({path: 'main.min.js'}),
            $.gp.uglify(),
            $.gp.debug({title: 'DEBUG "js.main": '}),
            $.gulp.dest('build/static/js/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "js.main": ',
                message: err.message
            }
        }));
    });
};