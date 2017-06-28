'use strict';

module.exports = function () {
    $.gulp.task('css.main', function () {
        return $.combiner(
            $.gulp.src(['build/static/css/components.css', 'build/static/css/blocks.css']),
            $.gp.concat({path: 'main.min.css'}),
            $.gp.cleanCss({level: 1}),
            $.gp.debug({title: 'DEBUG "css.main": '}),
            $.gulp.dest('build/static/css/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "css.main": ',
                message: err.message
            }
        }));
    });
};