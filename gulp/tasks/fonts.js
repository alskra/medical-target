'use strict';

module.exports = function () {
    $.gulp.task('fonts', function () {
        return $.combiner(
            $.gulp.src(JSON.parse($.fs.readFileSync($.paths.fonts)).map(function (fontPath) {return $.path.join(fontPath, '*.{woff*,ttf,eot,svg}');}),
                {base: $.path.resolve("sources/static/fonts/")}),
            $.gp.debug({title: 'DEBUG "fonts": '}),
            $.gulp.dest('build/static/fonts/'),
            $.browserSync.reload({stream: true})
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "fonts": ',
                message: err.message
            }
        }));
    });
};