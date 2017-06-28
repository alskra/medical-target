'use strict';

module.exports = function () {
    $.gulp.task('img', function() {
        return $.combiner(
            $.gulp.src(['sources/static/img/content/**/*.{png,jp*g,gif,svg}']
                .concat($.blocksArr.map(function (blockName) {return $.path.join(blockName, '*.{png,jp*g,gif,svg}');}))),
            $.gp.newer('build/static/img/content/'),
            $.gp.newer('build/static/img/general/'),
            $.gp.imagemin([
                $.gp.imagemin.gifsicle({interlaced: true}),
                require('imagemin-jpegoptim')({progressive: true, max: 80}),
                $.gp.imagemin.optipng({optimizationLevel: 5}),
                $.gp.imagemin.svgo({plugins: [{removeViewBox: false}]})
            ]),
            $.gp.debug({title: 'DEBUG "img": '}),
            $.gulp.dest(function (file) {
                return file.base.indexOf($.path.resolve('sources/static/img/content/')) !== -1 ? 'build/static/img/content/' : 'build/static/img/general/';
            })
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "img": ',
                message: err.message
            }
        }));
    });
};