'use strict';

module.exports = function () {
    $.gulp.task('js.blocks', function () {
        return $.combiner(
            $.gulp.src($.blocksArr.map(function (blockName) {return $.path.join(blockName, '*.js');})),
            $.gp.sourcemaps.init(),
            $.gp.concat({path: 'blocks.js'}, {newLine: '\n\n'}),
            $.gp.sourcemaps.write(),
            $.gp.debug({title: 'DEBUG "js.blocks": '}),
            $.gulp.dest('build/static/js/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "js.blocks": ',
                message: err.message
            }
        }));
    });
};