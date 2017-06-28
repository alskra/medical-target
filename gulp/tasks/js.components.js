'use strict';

module.exports = function () {
    $.gulp.task('js.components', function () {
        return $.combiner(
            $.gulp.src(JSON.parse($.fs.readFileSync($.paths.jsComponents))),
            $.gp.sourcemaps.init(),
            $.gp.concat({path: 'components.js'}),
            $.gp.sourcemaps.write(),
            $.gp.debug({title: 'DEBUG "js.components": '}),
            $.gulp.dest('build/static/js/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "js.components": ',
                message: err.message
            }
        }));
    });
};