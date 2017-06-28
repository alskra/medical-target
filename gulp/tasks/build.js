'use strict';

module.exports = function () {
    $.gulp.task('build', $.gulp.series('clean', $.gulp.parallel('generate-favicon', 'glyphicons'),
        'html', 'img', $.gulp.parallel('css.components', 'css.blocks', 'js.components', 'js.blocks', 'fonts', 'misc')));
};