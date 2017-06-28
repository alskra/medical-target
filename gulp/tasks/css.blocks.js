'use strict';

module.exports = function () {
    $.gulp.task('css.blocks', function () {
        return $.combiner(
            $.gulp.src($.blocksArr.map(function (blockName) {return $.path.join(blockName, '*.styl');}))
                .on('data', function (file) {
                    file.dirname = file.cwd;
                    //console.log(file.relative);
                }),
            $.gp.sourcemaps.init(),
            $.gp.if($.path.basename($.stylusChangedFile) !== 'variables.styl' && $.path.basename($.stylusChangedFile) !== 'mixins.styl', $.gp.cached('stylus')),
            $.gp.stylus({
                'include css': true,
                import: ['sources/components/bootstrap/css/variables.styl', 'sources/components/bootstrap/css/mixins.styl'],
                use: [$.autoprefixerStylus($.config.autoprefixer)]
            }),
            $.gp.debug({title: 'DEBUG "css.blocks - BEFORE remember": '}),
            $.gp.remember('stylus'),
            $.gp.debug({title: 'DEBUG "css.blocks - AFTER remember": '}),
            $.gp.concat({path: 'blocks.css'}),
            $.gp.sourcemaps.write(),
            $.gp.debug({title: 'DEBUG "css.blocks": '}),
            $.gulp.dest('build/static/css/')
        ).on('error', $.gp.notify.onError(function(err) {
            return {
                title: 'ERROR "css.blocks": ',
                message: err.message
            }
        }));
    });
};