'use strict';

module.exports = function () {
    $.gulp.task('glyphicons', function(){
        return $.combiner(
            $.gulp.src(['sources/static/fonts/glyphicons/icons/*.svg']),
            $.gp.iconfontCss({
                fontName: 'glyphicons',
                targetPath: '../../../../sources/static/fonts/glyphicons/glyphicons.css',
                fontPath: '../fonts/glyphicons/',
                cssClass: 'glyphicon',
                path: 'sources/static/fonts/glyphicons/.css_tmp'
            }),
            $.gp.iconfont({
                fontName: 'glyphicons',
                prependUnicode: true,
                formats: ['woff2', 'woff', 'ttf', 'eot', 'svg'],
                fontHeight: 600, //creating the icons larger allows for better rendering at sizes greater than 100px
                normalize: true
            }),
            $.gp.debug({title: 'DEBUG "glyphicons": '}),
            $.gulp.dest('build/static/fonts/glyphicons/'),
            $.browserSync.reload({stream: true})
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "glyphicons": ',
                message: err.message
            }
        }));
    });
};